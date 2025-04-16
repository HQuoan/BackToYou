using ImageService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PostAPI.Features.Posts.Dtos;
using PostAPI.Features.Posts.Queries;
using System.Security.Claims;

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
        if (!User.IsInRole(SD.AdminRole))
        {
            queryParameters.PostStatus = PostStatus.Approved;
        }

        var query = PostFeatures.Build(queryParameters);
        query.IncludeProperties = "Category,PostImages,PostLabel";

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

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<ResponseDto>> GetMyPosts([FromQuery] PostQueryParameters? queryParameters)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }
        queryParameters.UserId = userId;

        var query = PostFeatures.Build(queryParameters);
        query.IncludeProperties = "Category,PostImages,PostLabel";

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
    public async Task<ActionResult<ResponseDto>> GetById(Guid id)
    {
        Post post;
        bool isAdmin = User.IsInRole(SD.AdminRole);


        if (isAdmin)
        {
            post = await _unitOfWork.Post.GetAsync(c => c.PostId == id, includeProperties: "Category,PostImages,PostLabel");
        }   
        else
        {
            post = await _unitOfWork.Post.GetAsync(c => c.PostId == id && c.PostStatus == PostStatus.Approved, includeProperties: "Category,PostImages,PostLabel");

            if (post.PostStatus != PostStatus.Approved) {
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
                {
                    throw new BadRequestException("Invalid or missing user ID claim.");
                }

                if(userId != post.UserId)
                {
                    throw new ForbiddenException();
                }
            }
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
            post = await _unitOfWork.Post.GetAsync(c => c.Slug == slug, includeProperties: "Category,PostImages,PostLabel");
        }
        else
        {
            post = await _unitOfWork.Post.GetAsync(c => c.Slug == slug && c.PostStatus == PostStatus.Approved, includeProperties: "Category,PostImages,PostLabel");

            if (post.PostStatus != PostStatus.Approved)
            {
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
                {
                    throw new BadRequestException("Invalid or missing user ID claim.");
                }

                if (userId != post.UserId)
                {
                    throw new ForbiddenException();
                }
            }
        }

        if (post == null)
        {
            throw new PostNotFoundException(slug);
        }

        _response.Result = _mapper.Map<PostDto>(post);

        return Ok(_response);
    }


    [HttpPost]
    [Authorize]
    [Consumes("multipart/form-data")] // Bắt buộc để dùng IFormFile
    public async Task<ActionResult<ResponseDto>> Post([FromForm] PostCreateDto postDto)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }
        postDto.UserId = userId;

        Post post = _mapper.Map<Post>(postDto);
        post.PostStatus = PostStatus.Pending;

        if(post.PostLabelId == Guid.Parse(SD.PostLabel_Priority_Id))
        {
            // goi api ktra vi tien
            post.PostLabelId = Guid.Parse(SD.PostLabel_Priority_Id);

        }
        else
        {
            post.PostLabelId = Guid.Parse(SD.PostLabel_Normal_Id);

        }

        // Generate slug
        post.Slug = SlugGenerator.GenerateSlug(post.Title);

        await _unitOfWork.Post.AddAsync(post);

        if (postDto.ImageFiles == null || !(postDto.ImageFiles.Any()))
        {
            throw new BadRequestException("Post require images");
        }

        // upload images
        int i = 0;
        if(postDto.ThumbnailIndex >= postDto.ImageFiles.Count ||  postDto.ThumbnailIndex < 0)
            postDto.ThumbnailIndex = 0;

        foreach (var imgDto in postDto.ImageFiles)
        {
            var imageResult = await _imageUploader.UploadImageAsync(imgDto);
            if (!imageResult.IsSuccess) {
                throw new BadRequestException(imageResult.ErrorMessage);
            }

            var postImage = new PostImage
            {
                PostId = post.PostId,
                ImageUrl = imageResult.Url,
                PublicId = imageResult.PublicId,
            };
            await _unitOfWork.PostImage.AddAsync(postImage);

            if (i == postDto.ThumbnailIndex)
                post.ThumbnailUrl = imageResult.Url;

            i++;
        }

        // create follower 
        await _unitOfWork.Follower.AddAsync(new Follower
        {
            PostId = post.PostId,
            UserId = userId
        });

        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<PostDto>(post);

        return CreatedAtAction(nameof(GetById), new { id = post.PostId }, _response);
    }

    [HttpPut]
    //[Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> Put([FromBody] PostUpdateDto postDto)
    {
        if ((!postDto.RetainedImagePublicIds?.Any() ?? true) && (postDto.ImageFiles == null || !postDto.ImageFiles.Any()))
        {
            throw new BadRequestException("Post must contain at least one image.");
        }

        bool isAdmin = User.IsInRole(SD.AdminRole);

        Post postFromDb = await _unitOfWork.Post.GetAsync(c => c.PostId == postDto.PostId);
        if (postFromDb == null)
        {
            throw new PostNotFoundException(postDto.PostId);
        }

        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new ForbiddenException();
        }
        
        if(!isAdmin || userId != postFromDb.UserId)
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }


        postFromDb.Slug = SlugGenerator.GenerateSlug(postDto.Title);

        // Cập nhật các thuộc tính của movieFromDb từ movieDto
        _mapper.Map(postDto, postFromDb);

        //xử lý ảnh
        var queryImage = new QueryParameters<PostImage>();
        queryImage.Filters.Add(img => img.PostId == postDto.PostId);

        var existingImages = await _unitOfWork.PostImage
            .GetAllAsync(queryImage);

        // xóa ảnh cũ 
        var imagesToDelete = existingImages
                                .Where(img => !postDto.RetainedImagePublicIds.Contains(img.PublicId))
                                .ToList();

        foreach (var img in imagesToDelete)
        {
            var result = await _imageUploader.DeleteImageAsync(img.PublicId);
            if (result.IsSuccess)
            {
                await _unitOfWork.PostImage.RemoveAsync(img);
            }
            else
            {
                throw new BadRequestException(result.ErrorMessage);
            }
        }

        //  upload ảnh mới
        foreach (var imgDto in postDto.ImageFiles)
        {
            var imageResult = await _imageUploader.UploadImageAsync(imgDto);
            if (!imageResult.IsSuccess)
                throw new BadRequestException(imageResult.ErrorMessage);

            var postImage = new PostImage
            {
                PostId = postFromDb.PostId,
                ImageUrl = imageResult.Url,
                PublicId = imageResult.PublicId
            };
            await _unitOfWork.PostImage.AddAsync(postImage);
        }

        // update thumbnail
        var updatedImages = await _unitOfWork.PostImage.GetAllAsync(queryImage);
        if (postDto.ThumbnailIndex < 0 || postDto.ThumbnailIndex >= updatedImages.Count())
        {
            postDto.ThumbnailIndex = 0;
        }

        var thumb = updatedImages.ElementAtOrDefault(postDto.ThumbnailIndex);
        postFromDb.ThumbnailUrl = thumb?.ImageUrl;


        await _unitOfWork.Post.UpdateAsync(postFromDb);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<PostDto>(postFromDb);

        return Ok(_response);
    }

    [HttpPut]
    [Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> UpdatePostLabel([FromBody] PostUpdateLabel postDto)
    {
        Post postFromDb = await _unitOfWork.Post.GetAsync(c => c.PostId == postDto.PostId);
        if (postFromDb == null)
            throw new PostNotFoundException(postDto.PostId);

        _mapper.Map(postDto, postFromDb);

        await _unitOfWork.Post.UpdateAsync(postFromDb);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<PostDto>(postFromDb);

        return Ok(_response);
    }

        [HttpDelete]
    //[Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> Delete(Guid id)
    {
        var post = await _unitOfWork.Post.GetAsync(c => c.PostId == id);
        if (post == null)
        {
            throw new PostNotFoundException(id);
        }

        // xóa ảnh trên cloud
        var queryImage = new QueryParameters<PostImage>();
        queryImage.Filters.Add(img => img.PostId == id);

        var existingImages = await _unitOfWork.PostImage
            .GetAllAsync(queryImage);

        foreach (var img in existingImages)
        {
            var result = await _imageUploader.DeleteImageAsync(img.PublicId);
            if (!result.IsSuccess)
            {
                throw new BadRequestException(result.ErrorMessage);
            }
        }

        // xóa post và post images
        await _unitOfWork.Post.RemoveAsync(post);
        await _unitOfWork.SaveAsync();

        return Ok(_response);
    }
}

