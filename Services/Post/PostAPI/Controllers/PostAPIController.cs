using Microsoft.AspNetCore.Mvc;

namespace PostAPI.Controllers;
[Route("posts")]
[ApiController]
public class PostAPIController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private ResponseDto _response;
    public PostAPIController(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _response = new();
    }

    //[HttpGet]
    //public async Task<ActionResult<ResponseDto>> Get([FromQuery] MovieQueryParameters? queryParameters)
    //{
    //    if (!User.IsInRole(SD.AdminRole))
    //    {
    //        queryParameters.Status = true;
    //    }

    //    var query = MovieFeatures.Build(queryParameters);
    //    query.IncludeProperties = "Category,Country,Series,MovieGenres.Genre";

    //    IEnumerable<Movie> movies = await _unitOfWork.Movie.GetAllAsync(query);

    //    _response.Result = _mapper.Map<IEnumerable<MovieDetailsDto>>(movies);

    //    int totalItems = await _unitOfWork.Movie.CountAsync(query);
    //    _response.Pagination = new PaginationDto
    //    {
    //        TotalItems = totalItems,
    //        TotalItemsPerPage = queryParameters.PageSize,
    //        CurrentPage = queryParameters.PageNumber,
    //        TotalPages = (int)Math.Ceiling((double)totalItems / queryParameters.PageSize)
    //    };

    //    return Ok(_response);
    //}
}

