using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PostAPI.Features.PostImages.Dtos;
using PostAPI.Features.PostImages.Queries;
using PostAPI.Features.Posts.Dtos;
using PostAPI.Models;
using System.Text;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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

    [HttpPost("embedding")]
    public async Task<ActionResult<ResponseDto>> Embedding([FromBody] List<PostImageDto> images)
    {
        var data = _mapper.Map<IEnumerable<PostImageInput>>(images);
        using var httpClient = new HttpClient();
        var apiUrl = "http://localhost:8000/embedding/list";

        var json = JsonConvert.SerializeObject(data); // thay vì System.Text.Json
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await httpClient.PostAsync(apiUrl, content);
        var responseString = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            return BadRequest(new ResponseDto { IsSuccess = false, Message = responseString });
        }

        return Ok(new ResponseDto { IsSuccess = true, Message = responseString });
    }

    public class SearchResponseDto
    {
        public List<Match> Matches { get; set; }
    }

    public class Match
    {
        [JsonProperty("post_image_id")] // Ánh xạ với post_image_id trong JSON
        public string PostImageId { get; set; }

        [JsonProperty("similarity_score")] // Ánh xạ với similarity_score trong JSON
        public float SimilarityScore { get; set; }

        [JsonProperty("post_id")] // Ánh xạ với post_id trong JSON
        public string PostId { get; set; } // Nếu bạn cần trường này
    }

    public class AiSearchForm
    {
        public IFormFile File { get; set; }
        public string TextQuery { get; set; }
    }

    [HttpPost("ai-search")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<ResponseDto>> AiSearch([FromForm] AiSearchForm form)
    {
        try
        {
            using var httpClient = new HttpClient();
            httpClient.Timeout = TimeSpan.FromSeconds(300); // Tăng timeout
            var apiUrl = "http://localhost:8000/compare";
            using var content = new MultipartFormDataContent();

            if (form.File != null)
            {
                if (form.File.Length > 10_000_000) // Giới hạn 10MB
                {
                    return BadRequest(new ResponseDto { IsSuccess = false, Message = "File size exceeds limit (10MB)." });
                }

                Console.WriteLine($"Uploading file: {form.File.FileName}, Size: {form.File.Length}");
                var stream = form.File.OpenReadStream();
                var fileContent = new StreamContent(stream);
                fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(form.File.ContentType ?? "application/octet-stream");
                content.Add(fileContent, "file", form.File.FileName);
            }
            else if (!string.IsNullOrEmpty(form.TextQuery))
            {
                Console.WriteLine($"Text query: {form.TextQuery}");
                content.Add(new StringContent(form.TextQuery), "text_query");
            }
            else
            {
                return BadRequest("Missing file or text query");
            }

            Console.WriteLine("Sending request to AI service...");
            var response = await httpClient.PostAsync(apiUrl, content);
            var responseString = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Response: {responseString}");

            if (!response.IsSuccessStatusCode)
            {
                return BadRequest(new ResponseDto { IsSuccess = false, Message = $"Call to AI service failed: {responseString}" });
            }

            var resultObj = JsonConvert.DeserializeObject<SearchResponseDto>(responseString);

            var postIds = resultObj.Matches
                                 .Select(m => Guid.Parse(m.PostId.ToString()))
                                 .ToList();

            var queryPost = new QueryParameters<Post>();
            queryPost.Filters.Add(p => postIds.Contains(p.PostId));


            IEnumerable<Post> post = await _unitOfWork.Post.GetAllAsync(queryPost);

            _response.Result = _mapper.Map<IEnumerable<PostDto>>(post);

            return Ok(_response);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex}");
            return BadRequest(new ResponseDto { IsSuccess = false, Message = ex.ToString() });
        }
    }

    [HttpPost("test")]
    public async Task<ActionResult<ResponseDto>> Test([FromBody] List<Guid> ids)
    {
        //if (!User.IsInRole(SD.AdminRole))
        //{
        //    queryParameters.PostStatus = PostStatus.Resolved;
        //}

        var query = new QueryParameters<Post>();
        query.Filters.Add(p => ids.Contains(p.PostId));

        IEnumerable<Post> post = await _unitOfWork.Post.GetAllAsync(query);

        _response.Result = _mapper.Map<IEnumerable<PostDto>>(post);

        //int totalItems = await _unitOfWork.Post.CountAsync(query);
        //_response.Pagination = new PaginationDto
        //{
        //    TotalItems = totalItems,
        //    TotalItemsPerPage = queryParameters.PageSize,
        //    CurrentPage = queryParameters.PageNumber,
        //    TotalPages = (int)Math.Ceiling((double)totalItems / queryParameters.PageSize)
        //};

        return Ok(_response);
    }
}
