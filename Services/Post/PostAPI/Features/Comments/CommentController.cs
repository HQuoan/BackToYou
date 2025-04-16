using CommentAPI.Features.Comments.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PostAPI.Features.Comments.Dtos;
using PostAPI.Features.Comments.Queries;
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
        IEnumerable<Comment> categories = await _unitOfWork.Comment.GetAllAsync(query);

        _response.Result = _mapper.Map<IEnumerable<CommentDto>>(categories);

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
        var category = await _unitOfWork.Comment.GetAsync(c => c.CommentId == id);
        if (category == null)
        {
            throw new CommentNotFoundException(id);
        }

        _response.Result = _mapper.Map<CommentDto>(category);
        return Ok(_response);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ResponseDto>> Post([FromBody] CommentCreateDto categoryDto)
    {
        Comment category = _mapper.Map<Comment>(categoryDto);

        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }
        category.UserId = userId;


        await _unitOfWork.Comment.AddAsync(category);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<CommentDto>(category);

        return CreatedAtAction(nameof(GetById), new { id = category.CommentId }, _response);
    }

    [HttpPut]
    [Authorize]
    public async Task<ActionResult<ResponseDto>> Put([FromBody] CommentUpdateDto categoryDto)
    {
        Comment cateFromDb = await _unitOfWork.Comment.GetAsync(c => c.CommentId == categoryDto.CommentId);
        if (cateFromDb == null)
        {
            throw new CommentNotFoundException(categoryDto.CommentId);
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

        _mapper.Map(categoryDto, cateFromDb);

        await _unitOfWork.Comment.UpdateAsync(cateFromDb);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<CommentDto>(cateFromDb);

        return Ok(_response);
    }

    [HttpDelete]
    [Authorize]
    public async Task<ActionResult> Delete(Guid id)
    {
        var category = await _unitOfWork.Comment.GetAsync(c => c.CommentId == id);
        if (category == null)
        {
            throw new CommentNotFoundException(id);
        }

        bool isAdmin = User.IsInRole(SD.AdminRole);

        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }

        if (!isAdmin && userId != category.UserId)
        {
            throw new ForbiddenException();
        }

        await _unitOfWork.Comment.RemoveAsync(category);
        await _unitOfWork.SaveAsync();

        return Ok(_response);
    }
}
