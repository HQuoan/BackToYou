﻿using BuildingBlocks.Messaging.Events;
using CommentAPI.Features.Comments.Queries;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PostAPI.Features.Comments.Dtos;
using PostAPI.Features.Comments.Queries;
using System.Diagnostics.CodeAnalysis;
using System.Security.Claims;

namespace PostAPI.Features.Comments;
[Route("comments")]
[ApiController]
public class CommentAPIController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private ResponseDto _response;

    private readonly IPublishEndpoint _publishEndpoint;

    public CommentAPIController(IUnitOfWork unitOfWork, IMapper mapper, IPublishEndpoint publishEndpoint = null)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _response = new ResponseDto();
        _publishEndpoint = publishEndpoint;
    }

    [HttpGet]
    //[Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> Get([FromQuery] CommentQueryParameters queryParameters)
    {
        var query = CommentFeatures.Build(queryParameters);

        IEnumerable<Comment> comments = await _unitOfWork.Comment.GetAllAsync(query);

        _response.Result = _mapper.Map<IEnumerable<CommentDto>>(comments);

        int totalItems = await _unitOfWork.Comment.CountAsync(query);
        _response.Pagination = new PaginationDto
        {
            TotalItems = totalItems,
            TotalItemsPerPage = queryParameters.PageSize,
            CurrentPage = queryParameters.PageNumber,
            TotalPages = (int)Math.Ceiling((double)totalItems / queryParameters.PageSize)
        };

        return Ok(_response);
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<ResponseDto>> GetById(Guid id)
    {
        var comment = await _unitOfWork.Comment.GetAsync(c => c.CommentId == id, includeProperties: "ChildComments");
        if (comment == null)
        {
            throw new CommentNotFoundException(id);
        }

        _response.Result = _mapper.Map<CommentDto>(comment);
        return Ok(_response);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ResponseDto>> Post([FromBody] CommentCreateDto commentDto)
    {
        Comment comment = _mapper.Map<Comment>(commentDto);

        var post = await _unitOfWork.Post.GetAsync(p => p.PostId == comment.PostId);
        if (post == null)
            throw new PostNotFoundException(comment.PostId);

        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }
        comment.UserId = userId;

        var parentCmt = new Comment();
        if (comment.ParentCommentId != null) {
            parentCmt = await _unitOfWork.Comment.GetAsync(c => c.CommentId == commentDto.ParentCommentId);

            if (parentCmt == null)
                throw new NotFoundException("Comment parent", comment.ParentCommentId);

            comment.PostId = parentCmt.PostId;
        }


        await _unitOfWork.Comment.AddAsync(comment);
        await _unitOfWork.SaveAsync();


        // Xác định người cần nhận thông báo
        var recipients = new List<Guid>();

        var query = new QueryParameters<Follower>();
        query.Filters.Add(f => f.PostId == post.PostId && f.IsSubscribed == true);

        var followers = await _unitOfWork.Follower.GetAllAsync(query);

        foreach (var item in followers)
        {
            recipients.Add(item.UserId);
        }


        // Phát event
        await _publishEndpoint.Publish(new CommentAddedEvent
        {
            CommentId = comment.CommentId,
            PostId = comment.PostId,
            Slug = post.Slug,
            ParentCommentId = comment.ParentCommentId,
            CommenterId = comment.UserId,
            RecipientUserIds = recipients,
            Preview = comment.Description.Length > 50
                                 ? comment.Description[..50] + "…"
                                 : comment.Description
        });

        _response.Result = _mapper.Map<CommentDto>(comment);

        return CreatedAtAction(nameof(GetById), new { id = comment.CommentId }, _response);
    }

    [HttpPut]
    [Authorize]
    public async Task<ActionResult<ResponseDto>> Put([FromBody] CommentUpdateDto commentDto)
    {
        Comment cmtFromDb = await _unitOfWork.Comment.GetAsync(c => c.CommentId == commentDto.CommentId);
        if (cmtFromDb == null)
        {
            throw new CommentNotFoundException(commentDto.CommentId);
        }

        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }

        if (userId != cmtFromDb.UserId)
        {
            throw new ForbiddenException();
        }

        _mapper.Map(commentDto, cmtFromDb);

        await _unitOfWork.Comment.UpdateAsync(cmtFromDb);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<CommentDto>(cmtFromDb);

        return Ok(_response);
    }

    //[HttpDelete("{id}")]
    //[Authorize]
    //public async Task<ActionResult> Delete(Guid id)
    //{
    //    var comment = await _unitOfWork.Comment.GetAsync(c => c.CommentId == id);
    //    if (comment == null)
    //    {
    //        throw new CommentNotFoundException(id);
    //    }

    //    bool isAdmin = User.IsInRole(SD.AdminRole);

    //    var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
    //    if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
    //    {
    //        throw new BadRequestException("Invalid or missing user ID claim.");
    //    }

    //    if (!isAdmin && userId != comment.UserId)
    //    {
    //        throw new ForbiddenException();
    //    }

    //    await _unitOfWork.Comment.RemoveAsync(comment);
    //    await _unitOfWork.SaveAsync();

    //    return Ok(_response);
    //}

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult> Delete(Guid id)
    {
        // Lấy comment cùng các comment con
        var comment = await _unitOfWork.Comment
            .GetAsync(c => c.CommentId == id, includeProperties: "ChildComments");

        if (comment == null)
        {
            throw new CommentNotFoundException(id);
        }

        bool isAdmin = User.IsInRole(SD.AdminRole);

        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim?.Value, out Guid userId))
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }

        if (!isAdmin && userId != comment.UserId)
        {
            throw new ForbiddenException();
        }

        // Đệ quy xóa comment con
        await DeleteCommentRecursive(comment);

        await _unitOfWork.SaveAsync();
        return Ok(_response);
    }

    // Hàm đệ quy xóa comment và con của nó
    private async Task DeleteCommentRecursive(Comment comment)
    {
        // Load ChildComments nếu chưa có (tránh null)
        if (comment.ChildComments == null)
        {
            var query = new QueryParameters<Comment>();
            query.Filters.Add(c => c.ParentCommentId == comment.CommentId);

            comment.ChildComments = (ICollection<Comment>?)await _unitOfWork.Comment
                .GetAllAsync(query);
        }

        foreach (var child in comment.ChildComments.ToList())
        {
            await DeleteCommentRecursive(child);
        }

        await _unitOfWork.Comment.RemoveAsync(comment);
    }

}
