using Microsoft.AspNetCore.Mvc;
using PostAPI.Features.Posts.Dtos;
using PostAPI.Features.Posts.Queries;

namespace PostAPI.Features.PostImages;
[Route("post-images")]
[ApiController]
public class PostImageAPIController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private ResponseDto _response;

    public PostImageAPIController(IMapper mapper, IUnitOfWork unitOfWork)
    {
        _mapper = mapper;
        _unitOfWork = unitOfWork;
        _response = new();
    }

    [HttpGet]
    public async Task<ActionResult<ResponseDto>> Get([FromQuery] CommentQueryParameters? queryParameters)
    {
        //if (!User.IsInRole(SD.AdminRole))
        //{
        //    queryParameters.PostStatus = PostStatus.Resolved;
        //}

        var query = CommentFeatures.Build(queryParameters);
        query.IncludeProperties = "Category,PostImages";

        IEnumerable<Post> posts = await _unitOfWork.Post.GetAllAsync(query);

        _response.Result = _mapper.Map<IEnumerable<PostDto>>(posts);

        int totalItems = await _unitOfWork.Post.CountAsync(query);
        _response.Pagination = new PaginationDto
        {
            TotalItems = totalItems,
            TotalItemsPerPage = queryParameters.PageSize,
            CurrentPage = queryParameters.PageNumber,
            TotalPages = (int)Math.Ceiling((double)totalItems / queryParameters.PageSize)
        };

        return Ok(_response);
    }
}
