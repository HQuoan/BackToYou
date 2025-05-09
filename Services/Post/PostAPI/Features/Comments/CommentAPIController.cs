using CommentAPI.Features.Comments.Queries;
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

    public CommentAPIController(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _response = new ResponseDto();
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
        var comment = await _unitOfWork.Comment.GetAsync(c => c.CommentId == id);
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

        var post = await _unitOfWork.Post.GetAsync(p => p.PostId == comment.PostId);
        if (post == null)
            throw new PostNotFoundException(comment.PostId);


        await _unitOfWork.Comment.AddAsync(comment);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<CommentDto>(comment);

        return CreatedAtAction(nameof(GetById), new { id = comment.CommentId }, _response);
    }

    [HttpPut]
    [Authorize]
    public async Task<ActionResult<ResponseDto>> Put([FromBody] CommentUpdateDto commentDto)
    {
        Comment cateFromDb = await _unitOfWork.Comment.GetAsync(c => c.CommentId == commentDto.CommentId);
        if (cateFromDb == null)
        {
            throw new CommentNotFoundException(commentDto.CommentId);
        }

        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }

        if (userId != cateFromDb.UserId)
        {
            throw new ForbiddenException();
        }

        _mapper.Map(commentDto, cateFromDb);

        await _unitOfWork.Comment.UpdateAsync(cateFromDb);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<CommentDto>(cateFromDb);

        return Ok(_response);
    }

    [HttpDelete]
    [Authorize]
    public async Task<ActionResult> Delete(Guid id)
    {
        var comment = await _unitOfWork.Comment.GetAsync(c => c.CommentId == id);
        if (comment == null)
        {
            throw new CommentNotFoundException(id);
        }

        bool isAdmin = User.IsInRole(SD.AdminRole);

        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }

        if (!isAdmin && userId != comment.UserId)
        {
            throw new ForbiddenException();
        }

        await _unitOfWork.Comment.RemoveAsync(comment);
        await _unitOfWork.SaveAsync();

        return Ok(_response);
    }
}
