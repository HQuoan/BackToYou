using Microsoft.AspNetCore.Mvc;
using PostAPI.Features.PostImages.Dtos;
using PostAPI.Features.PostImages.Queries;
using PostAPI.Features.Posts.Dtos;

namespace PostAPI.Features.PostImages;
[Route("post-images")]
[ApiController]
public class PostImageAPIController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private ResponseDto _response;
    private IAIService _aiService;

    public PostImageAPIController(IMapper mapper, IUnitOfWork unitOfWork, IAIService aiService)
    {
        _mapper = mapper;
        _unitOfWork = unitOfWork;
        _response = new();
        _aiService = aiService;
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


    [HttpPost("embedding/{postId}")]
    public async Task<ActionResult<ResponseDto>> Embedding(Guid postId)
    {
        var post = await _unitOfWork.Post.GetAsync(p => p.PostId == postId);
        if (post == null)
            throw new PostNotFoundException(postId);

        var query = new QueryParameters<PostImage>();
        query.Filters.Add(i => i.PostId == postId);

        var images = await _unitOfWork.PostImage.GetAllAsync(query);
        var data = _mapper.Map<List<PostImageInput>>(images);

        var responseString = await _aiService.Embedding(data);


        post.IsEmbedded = true;
        await _unitOfWork.Post.UpdateAsync(post);
        await _unitOfWork.SaveAsync();

        _response.Message = responseString;

        return Ok(_response);
    }


    [HttpDelete("embedding/{postId}")]
    public async Task<ActionResult<ResponseDto>> DeleteEmbedding(Guid postId)
    {

        var post = await _unitOfWork.Post.GetAsync(p => p.PostId == postId);
        if (post == null)
            throw new PostNotFoundException(postId);

        var responseString = await _aiService.DeleteEmbedding(postId);

        post.IsEmbedded = false;
        await _unitOfWork.Post.UpdateAsync(post);
        await _unitOfWork.SaveAsync();

        _response.Message = responseString;

        return Ok(_response);
    }


    //[HttpPost("embedding/all")]
    //public async Task<ActionResult<ResponseDto>> EmbeddingAll()
    //{
    //    var query = new QueryParameters<PostImage>
    //    {
    //        PageSize = 0,
    //    };

    //    var images = await _unitOfWork.PostImage.GetAllAsync(query);

    //    var data = _mapper.Map<List<PostImageInput>>(images);

    //    var responseString = await _aiService.Embedding(data);

    //    _response.Message = responseString;

    //    return Ok(_response);
    //}

    [HttpPost("embedding/all")]
    public async Task<ActionResult<ResponseDto>> EmbeddingAll()
    {
        var query = new QueryParameters<PostImage>
        {
            PageSize = 0,
        };

        var images = await _unitOfWork.PostImage.GetAllAsync(query);
        var data = _mapper.Map<List<PostImageInput>>(images);

        // Gửi mà không đợi phản hồi
        _ = Task.Run(async () =>
        {
            try
            {
                await _aiService.Embedding(data);
            }
            catch (Exception ex)
            {
                // Ghi log nếu muốn
                Console.WriteLine($"Embedding error: {ex.Message}");
            }
        });

        _response.Message = "Đã gửi yêu cầu embedding, đang xử lý nền.";
        return Ok(_response);
    }


    [HttpPost("ai-search")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<ResponseDto>> AiSearch([FromForm] AiSearchForm form)
    {
        var resultObj = await _aiService.Compare(form);
        if (resultObj == null)
            throw new BadRequestException("Compare failed");

        var postIds = resultObj.Matches
                              .Select(m => Guid.Parse(m.PostId))
                              .Distinct()
                              .ToList();

        var queryPost = new QueryParameters<Post>
        {
            Filters = { p => postIds.Contains(p.PostId) },
            IncludeProperties = "Category,PostImages"
        };


        var posts = await _unitOfWork.Post.GetAllAsync(queryPost);
        var postDtos = _mapper.Map<IEnumerable<PostDto>>(posts);

        var result = new List<object>();

        foreach (var match in resultObj.Matches)
        {
            var post = postDtos.FirstOrDefault(p =>
                p.PostImages.Any(img => img.PostImageId.ToString() == match.PostImageId));

            if (post != null)
            {
                result.Add(new
                {
                    Post = post,
                    match.SimilarityScore,
                    match.PostImageId
                });
            }
        }

        _response.Result = result;

        return Ok(_response);
    }
}
