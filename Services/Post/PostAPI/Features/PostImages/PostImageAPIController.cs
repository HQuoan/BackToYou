using Microsoft.AspNetCore.Mvc;
using PostAPI.Features.PostImages.Dtos;
using PostAPI.Features.PostImages.Queries;

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
    public async Task<ActionResult<ResponseDto>> Get([FromQuery] PostImageQueryParameters? queryParameters)
    {
        //if (!User.IsInRole(SD.AdminRole))
        //{
        //    queryParameters.PostStatus = PostStatus.Resolved;
        //}

        var query = PostImageFeatures.Build(queryParameters);
        query.IncludeProperties = "Category,PostImages";

        IEnumerable<PostImage> postImages = await _unitOfWork.PostImage.GetAllAsync(query);

        _response.Result = _mapper.Map<IEnumerable<PostImageDto>>(postImages);

        int totalItems = await _unitOfWork.PostImage.CountAsync(query);
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
