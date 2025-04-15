using ImageService;
using Microsoft.AspNetCore.Mvc;
using PostAPI.Features.Posts.Dtos;
using PostAPI.Features.Posts.Queries;

namespace PostAPI.Features.Posts;
[Route("posts")]
[ApiController]
public class PostAPIController : ControllerBase
{
    private readonly IImageUploader _imageUploader;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private ResponseDto _response;
    public PostAPIController(IUnitOfWork unitOfWork, IMapper mapper, IImageUploader imageUploader)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _response = new();
        _imageUploader = imageUploader;
    }

    [HttpGet]
    public async Task<ActionResult<ResponseDto>> Get([FromQuery] PostQueryParameters? queryParameters)
    {
        //if (!User.IsInRole(SD.AdminRole))
        //{
        //    queryParameters.PostStatus = PostStatus.Resolved;
        //}

        var query = PostFeatures.Build(queryParameters);
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

    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<ResponseDto>> GetById(string id)
    {
        Post post;
        bool isAdmin = User.IsInRole(SD.AdminRole);
        if (isAdmin)
        {
            post = await _unitOfWork.Post.GetAsync(c => c.PostId.ToString() == id, includeProperties: "Category,PostImages");
        }
        else
        {
            post = await _unitOfWork.Post.GetAsync(c => c.PostId.ToString() == id && c.PostStatus == PostStatus.Resolved, includeProperties: "Category,PostImages");
        }

        if (post == null)
        {
            throw new PostNotFoundException(id);
        }

        _response.Result = _mapper.Map<PostDto>(post);

        return Ok(_response);
    }

    [HttpGet]
    [Route("by-slug/{slug}")]
    public async Task<ActionResult<ResponseDto>> GetBySlug(string slug)
    {
        Post post;
        bool isAdmin = User.IsInRole(SD.AdminRole);
        if (isAdmin)
        {
            post = await _unitOfWork.Post.GetAsync(c => c.Slug == slug, includeProperties: "Category,PostImages");
        }
        else
        {
            post = await _unitOfWork.Post.GetAsync(c => c.Slug == slug && c.PostStatus == PostStatus.Resolved, includeProperties: "Category,PostImages");
        }

        if (post == null)
        {
            throw new PostNotFoundException(slug);
        }

        _response.Result = _mapper.Map<PostDto>(post);

        return Ok(_response);
    }


    [HttpPost]
    [Consumes("multipart/form-data")] // Bắt buộc để dùng IFormFile
    public async Task<ActionResult<ResponseDto>> Post([FromForm] PostCreateDto postDto)
    {
        Post post = _mapper.Map<Post>(postDto);
        post.PostStatus = PostStatus.Pending;

        // Generate slug
        post.Slug = SlugGenerator.GenerateSlug(post.Title);

        await _unitOfWork.Post.AddAsync(post);

        if (postDto.ImageFiles == null || !(postDto.ImageFiles.Any()))
        {
            throw new BadRequestException("Post require images");
        }

        // upload images
        int i = 0;
        if(postDto.ThumbnailIndex > postDto.ImageFiles.Count ||  postDto.ThumbnailIndex < 0)
            postDto.ThumbnailIndex = 0;

        foreach (var imgDto in postDto.ImageFiles)
        {
            var imageUrl = await _imageUploader.UploadImageAsync(imgDto);
            var postImage = new PostImage
            {
                PostId = post.PostId,
                ImageUrl = imageUrl,
            };
            await _unitOfWork.PostImage.AddAsync(postImage);

            if(i == postDto.ThumbnailIndex)
                post.ThumbnailUrl = imageUrl;

            i++;
        }

        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<PostDto>(post);

        return CreatedAtAction(nameof(GetById), new { id = post.PostId }, _response);
    }

    [HttpPut]
    //[Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> Put([FromBody] PostUpdateDto postDto)
    {
        Post postFromDb = await _unitOfWork.Post.GetAsync(c => c.PostId == postDto.PostId);
        if (postFromDb == null)
        {
            throw new PostNotFoundException(postDto.PostId);
        }

        postDto.Slug = SlugGenerator.GenerateSlug(postDto.Title);

        // Cập nhật các thuộc tính của movieFromDb từ movieDto
        _mapper.Map(postDto, postFromDb);

        await _unitOfWork.Post.UpdateAsync(postFromDb);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<PostDto>(postFromDb);

        return Ok(_response);
    }

    [HttpDelete]
    //[Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> Delete(string id)
    {
        var post = await _unitOfWork.Post.GetAsync(c => c.PostId.ToString() == id);
        if (post == null)
        {
            throw new PostNotFoundException(id);
        }

        await _unitOfWork.Post.RemoveAsync(post);
        await _unitOfWork.SaveAsync();

        return Ok(_response);
    }

}

