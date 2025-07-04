﻿//using Microsoft.AspNetCore.Mvc;
//using Newtonsoft.Json;
//using PostAPI.Features.PostImages.Dtos;
//using PostAPI.Features.PostImages.Queries;
//using PostAPI.Features.Posts.Dtos;
//using System.Text;

//namespace PostAPI.Features.PostImages;
//[Route("post-images")]
//[ApiController]
//public class PostImageAPIController : ControllerBase
//{
//    private readonly IUnitOfWork _unitOfWork;
//    //private readonly ITranslateService _translateService;
//    private readonly IMapper _mapper;
//    private ResponseDto _response;
//    //private const string BASE_URL = "http://host.docker.internal:8000";
//    private const string BASE_URL = "https://glowworm-precise-slightly.ngrok-free.app";

//    public PostImageAPIController(IMapper mapper, IUnitOfWork unitOfWork)
//    {
//        _mapper = mapper;
//        _unitOfWork = unitOfWork;
//        _response = new();
//    }

//    [HttpGet]
//    public async Task<ActionResult<ResponseDto>> Get([FromQuery] PostImageQueryParameters? queryParameters)
//    {
//        //if (!User.IsInRole(SD.AdminRole))
//        //{
//        //    queryParameters.PostStatus = PostStatus.Resolved;
//        //}

//        var query = PostImageFeatures.Build(queryParameters);

//        IEnumerable<PostImage> postImages = await _unitOfWork.PostImage.GetAllAsync(query);

//        _response.Result = _mapper.Map<IEnumerable<PostImageDto>>(postImages);

//        int totalItems = await _unitOfWork.PostImage.CountAsync(query);
//        _response.Pagination = new PaginationDto
//        {
//            TotalItems = totalItems,
//            TotalItemsPerPage = queryParameters.PageSize,
//            CurrentPage = queryParameters.PageNumber,
//            TotalPages = (int)Math.Ceiling((double)totalItems / queryParameters.PageSize)
//        };

//        return Ok(_response);
//    }


//    //[HttpPost("embedding")]
//    //public async Task<ActionResult<ResponseDto>> Embedding([FromBody] List<PostImageDto> images)
//    //{
//    //    var data = _mapper.Map<IEnumerable<PostImageInput>>(images);
//    //    using var httpClient = new HttpClient();

//    //    var apiUrl = $"{BASE_URL}/embedding";

//    //    var json = JsonConvert.SerializeObject(data); // thay vì System.Text.Json
//    //    var content = new StringContent(json, Encoding.UTF8, "application/json");

//    //    var response = await httpClient.PostAsync(apiUrl, content);
//    //    var responseString = await response.Content.ReadAsStringAsync();

//    //    if (!response.IsSuccessStatusCode)
//    //    {
//    //        return BadRequest(new ResponseDto { IsSuccess = false, Message = responseString });
//    //    }

//    //    return Ok(new ResponseDto { IsSuccess = true, Message = responseString });
//    //}

//    [HttpPost("embedding/{postId}")]
//    public async Task<ActionResult<ResponseDto>> Embedding(Guid postId)
//    {
//        var query = new QueryParameters<PostImage>();
//        query.Filters.Add(i => i.PostId == postId);

//        var images = await _unitOfWork.PostImage.GetAllAsync(query);
//        var data = _mapper.Map<IEnumerable<PostImageInput>>(images);

//        using var httpClient = new HttpClient();
//        var apiUrl = $"{BASE_URL}/embedding";

//        var json = JsonConvert.SerializeObject(data);
//        var content = new StringContent(json, Encoding.UTF8, "application/json");

//        var response = await httpClient.PostAsync(apiUrl, content);
//        var responseString = await response.Content.ReadAsStringAsync();

//        if (!response.IsSuccessStatusCode)
//        {
//            return BadRequest(new ResponseDto { IsSuccess = false, Message = responseString });
//        }

//        var post = await _unitOfWork.Post.GetAsync(p => p.PostId == postId);
//        if (post != null)
//        {
//            post.IsEmbedded = true;
//            await _unitOfWork.Post.UpdateAsync(post);
//            await _unitOfWork.SaveAsync();
//        }

//        return Ok(new ResponseDto { IsSuccess = true, Message = responseString });
//    }


//    [HttpDelete("embedding/{postId}")]
//    public async Task<ActionResult<ResponseDto>> DeleteEmbedding(Guid postId)
//    {
//        var apiUrl = $"{BASE_URL}/{postId}";

//        using var httpClient = new HttpClient();
//        var response = await httpClient.DeleteAsync(apiUrl);
//        var responseString = await response.Content.ReadAsStringAsync();

//        if (!response.IsSuccessStatusCode)
//        {
//            return BadRequest(new ResponseDto { IsSuccess = false, Message = responseString });
//        }

//        var post = await _unitOfWork.Post.GetAsync(p => p.PostId == postId);
//        if (post != null)
//        {
//            post.IsEmbedded = false;
//            await _unitOfWork.Post.UpdateAsync(post);
//            await _unitOfWork.SaveAsync(); 
//        }

//        return Ok(new ResponseDto { IsSuccess = true, Message = responseString });
//    }


//    [HttpPost("embedding/all")]
//    public async Task<ActionResult<ResponseDto>> EmbeddingAll()
//    {
//        var query = new QueryParameters<PostImage>
//        {
//            PageSize = 0,
//        };

//        var images = await _unitOfWork.PostImage.GetAllAsync(query);

//        var data = _mapper.Map<IEnumerable<PostImageInput>>(images);

//        using var httpClient = new HttpClient();
//        var apiUrl = $"{BASE_URL}/embedding";



//        var json = JsonConvert.SerializeObject(data); // thay vì System.Text.Json
//        var content = new StringContent(json, Encoding.UTF8, "application/json");

//        var response = await httpClient.PostAsync(apiUrl, content);
//        var responseString = await response.Content.ReadAsStringAsync();

//        if (!response.IsSuccessStatusCode)
//        {
//            return BadRequest(new ResponseDto { IsSuccess = false, Message = responseString });
//        }

//        return Ok(new ResponseDto { IsSuccess = true, Message = responseString });
//    }

//    public class SearchResponseDto
//    {
//        public List<Match> Matches { get; set; }
//    }

//    public class Match
//    {
//        [JsonProperty("post_image_id")] // Ánh xạ với post_image_id trong JSON
//        public string PostImageId { get; set; }

//        [JsonProperty("similarity_score")] // Ánh xạ với similarity_score trong JSON
//        public float SimilarityScore { get; set; }

//        [JsonProperty("post_id")] // Ánh xạ với post_id trong JSON
//        public string PostId { get; set; } // Nếu bạn cần trường này
//    }

//    public class AiSearchForm
//    {
//        public IFormFile File { get; set; }
//        public string? TextQuery { get; set; }
//        public int? Top { get; set; }
//    }

//    [HttpPost("ai-search")]
//    [Consumes("multipart/form-data")]
//    public async Task<ActionResult<ResponseDto>> AiSearch([FromForm] AiSearchForm form)
//    {
//        try
//        {
//            using var httpClient = new HttpClient();
//            httpClient.Timeout = TimeSpan.FromSeconds(300); // Tăng timeout

//            var apiUrl = $"{BASE_URL}/compare";


//            using var content = new MultipartFormDataContent();

//            if (form.File != null)
//            {
//                if (form.File.Length > 10_000_000) // Giới hạn 10MB
//                {
//                    return BadRequest(new ResponseDto { IsSuccess = false, Message = "File size exceeds limit (10MB)." });
//                }

//                Console.WriteLine($"Uploading file: {form.File.FileName}, Size: {form.File.Length}");
//                var stream = form.File.OpenReadStream();
//                var fileContent = new StreamContent(stream);
//                fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(form.File.ContentType ?? "application/octet-stream");
//                content.Add(fileContent, "file", form.File.FileName);
//            }
//            else if (!string.IsNullOrEmpty(form.TextQuery))
//            {
//                Console.WriteLine($"Text query: {form.TextQuery}");

//                content.Add(new StringContent(form.TextQuery), "text_query");
//            }
//            else
//            {
//                return BadRequest("Missing file or text query");
//            }
//            content.Add(new StringContent(form.Top.ToString()), "top_k");


//            Console.WriteLine("Sending request to AI service...");
//            var response = await httpClient.PostAsync(apiUrl, content);
//            var responseString = await response.Content.ReadAsStringAsync();
//            Console.WriteLine($"Response: {responseString}");

//            if (!response.IsSuccessStatusCode)
//            {
//                return BadRequest(new ResponseDto { IsSuccess = false, Message = $"Call to AI service failed: {responseString}" });
//            }

//            var resultObj = JsonConvert.DeserializeObject<SearchResponseDto>(responseString);

//            var postIds = resultObj.Matches
//                                  .Select(m => Guid.Parse(m.PostId))
//                                  .Distinct()
//                                  .ToList();

//            var queryPost = new QueryParameters<Post>
//            {
//                Filters = { p => postIds.Contains(p.PostId) },
//                IncludeProperties = "Category,PostImages"
//            };


//            var posts = await _unitOfWork.Post.GetAllAsync(queryPost);
//            var postDtos = _mapper.Map<IEnumerable<PostDto>>(posts);

//            var result = new List<object>();

//            foreach (var match in resultObj.Matches)
//            {
//                var post = postDtos.FirstOrDefault(p =>
//                    p.PostImages.Any(img => img.PostImageId.ToString() == match.PostImageId));

//                if (post != null)
//                {
//                    result.Add(new
//                    {
//                        Post = post,
//                        match.SimilarityScore,
//                        match.PostImageId
//                    });
//                }
//            }

//            _response.Result = result;

//            return Ok(_response);
//        }
//        catch (Exception ex)
//        {
//            Console.WriteLine($"Error: {ex}");
//            return BadRequest(new ResponseDto { IsSuccess = false, Message = ex.ToString() });
//        }
//    }

//    [HttpPost("test")]
//    public async Task<ActionResult<ResponseDto>> Test([FromBody] List<Guid> ids)
//    {
//        //if (!User.IsInRole(SD.AdminRole))
//        //{
//        //    queryParameters.PostStatus = PostStatus.Resolved;
//        //}

//        var query = new QueryParameters<Post>();
//        query.Filters.Add(p => ids.Contains(p.PostId));

//        IEnumerable<Post> post = await _unitOfWork.Post.GetAllAsync(query);

//        _response.Result = _mapper.Map<IEnumerable<PostDto>>(post);

//        //int totalItems = await _unitOfWork.Post.CountAsync(query);
//        //_response.Pagination = new PaginationDto
//        //{
//        //    TotalItems = totalItems,
//        //    TotalItemsPerPage = queryParameters.PageSize,
//        //    CurrentPage = queryParameters.PageNumber,
//        //    TotalPages = (int)Math.Ceiling((double)totalItems / queryParameters.PageSize)
//        //};

//        return Ok(_response);
//    }
//}
