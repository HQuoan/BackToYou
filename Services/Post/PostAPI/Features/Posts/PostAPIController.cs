﻿using ImageService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PostAPI.Features.Posts.Dtos;
using PostAPI.Features.Posts.Queries;
using System.Linq.Expressions;
using System.Security.Claims;

namespace PostAPI.Features.Posts;
[Route("posts")]
[ApiController]
public class PostAPIController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IPaymentService _paymentService;
    private readonly IImageUploader _imageUploader;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private ResponseDto _response;
    public PostAPIController(IUnitOfWork unitOfWork, IMapper mapper, IImageUploader imageUploader, IPaymentService paymentService, IUserService userService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _response = new();
        _imageUploader = imageUploader;
        _paymentService = paymentService;
        _userService = userService;
    }

    public class TimePeriodCategoryDto
    {
        public string TimePeriod { get; set; }
        public List<CategoryCountDto> Categories { get; set; }
    }

    public class CategoryCountDto
    {
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int PostCount { get; set; }
    }

    [HttpGet("posts-by-category/{lastDay}")]
    public async Task<ActionResult<ResponseDto>> GetPostsByCategory(int lastDay = 7)
    {
        if (lastDay <= 0) lastDay = 7;

        var today = DateTime.Now;
        var startDate = today.Date.AddDays(-lastDay + 1); // Bao gồm cả ngày hôm nay
        var endDate = today.Date.AddDays(1).AddTicks(-1); // Tới 23:59:59.999...

        var queryParameters = new QueryParameters<Post>
        {
            PageSize = 0,
            Filters = new List<Expression<Func<Post, bool>>>
                {
                    p => p.CreatedAt >= startDate && p.CreatedAt <= endDate
                },
            IncludeProperties = "Category"
        };

        var posts = await _unitOfWork.Post.GetAllAsync(queryParameters);

        // Nhóm bài đăng theo danh mục và đếm số lượng
        var categoryCounts = posts
            .GroupBy(p => new { p.CategoryId, p.Category.Name })
            .Select(g => new CategoryCountDto
            {
                CategoryId = g.Key.CategoryId,
                CategoryName = g.Key.Name,
                PostCount = g.Count()
            })
            .ToList();

        _response.Result = new TimePeriodCategoryDto
        {
            TimePeriod = $"{startDate:yyyy-MM-dd} to {endDate:yyyy-MM-dd}",
            Categories = categoryCounts
        };

        _response.Pagination = new PaginationDto
        {
            TotalItems = categoryCounts.Sum(c => c.PostCount),
            TotalItemsPerPage = categoryCounts.Count,
            CurrentPage = 1,
            TotalPages = 1
        };


        return Ok(_response);
    }

    [HttpGet]
    public async Task<ActionResult<ResponseDto>> Get([FromQuery] PostQueryParameters? queryParameters)
    {
        if (!User.IsInRole(SD.AdminRole))
        {
            queryParameters.PostStatus = PostStatus.Approved;
        }


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

    [HttpGet("posts-with-users")]
    //[Authorize(Roles = SD.AdminRole)]
    public async Task<IActionResult> GetPostsWithUsers([FromQuery] PostQueryParameters? queryParameters)
    {
        List<UserDto> users = null;
        List<Guid> userIds = null;

        // Nếu có lọc theo email
        if (!string.IsNullOrWhiteSpace(queryParameters.UserEmail))
        {
            users = await _userService.SearchUsersByEmail(queryParameters.UserEmail);

            // Không tìm thấy user nào thì trả về danh sách rỗng
            if (users.Count == 0)
            {
                _response.Result = new List<PostDto>();
                return Ok(_response);
            }

            userIds = users.Select(u => Guid.Parse(u.Id)).Distinct().ToList();
        }

        // Xây query cho Post
        var query = PostFeatures.Build(queryParameters);
        query.IncludeProperties = "Category,PostImages";

        if (userIds != null)
        {
            query.Filters.Add(p => userIds.Contains(p.UserId));
        }

        // Lấy danh sách bài viết
        var posts = await _unitOfWork.Post.GetAllAsync(query);
        var postDtos = _mapper.Map<List<PostDto>>(posts);

        // Lấy danh sách user theo UserId từ post nếu không lọc theo email
        if (userIds == null)
        {
            var userIdsFromPosts = posts.Select(p => p.UserId.ToString()).Distinct().ToList();

            if (userIdsFromPosts.Count > 0)
            {
                try
                {
                    users = await _userService.GetUsersByIds(userIdsFromPosts);
                }
                catch
                {
                    users = new List<UserDto>();
                }
            }
        }

        // Gán thông tin user vào từng post
        if (users != null && users.Count > 0)
        {
            var userDict = users.ToDictionary(u => u.Id);

            foreach (var post in postDtos)
            {
                if (userDict.TryGetValue(post.UserId.ToString(), out var user))
                {
                    post.User = user;
                }
            }
        }

        // Phân trang
        int totalItems = await _unitOfWork.Post.CountAsync(query);

        _response.Result = postDtos;
        _response.Pagination = new PaginationDto
        {
            TotalItems = totalItems,
            TotalItemsPerPage = queryParameters.PageSize,
            CurrentPage = queryParameters.PageNumber,
            TotalPages = (int)Math.Ceiling((double)totalItems / queryParameters.PageSize)
        };

        return Ok(_response);
    }


    //[HttpGet("posts-with-users")]
    ////[Authorize(Roles = SD.AdminRole)]
    //public async Task<IActionResult> GetPostsWithUsers([FromQuery] PostQueryParameters? queryParameters)
    //{
    //    UserDto user = null;
    //    if (!string.IsNullOrWhiteSpace(queryParameters.UserEmail))
    //    {
    //        user = await _userService.GetUserByEmail(queryParameters.UserEmail);
    //        if (user == null)
    //        {
    //            _response.Result = new List<PostDto>();
    //            return Ok(_response);
    //        }

    //        queryParameters.UserId = Guid.Parse(user.Id);
    //    }

    //    var query = PostFeatures.Build(queryParameters);
    //    query.IncludeProperties = "Category,PostImages";

    //    var posts = await _unitOfWork.Post.GetAllAsync(query);
    //    var postDtos = _mapper.Map<List<PostDto>>(posts);

    //    if (user != null)
    //    {
    //        postDtos.ForEach(p => p.User = user);
    //    }
    //    else
    //    {
    //        var userIds = posts.Select(p => p.UserId.ToString()).Distinct().ToList();

    //        List<UserDto> userDtos = new();
    //        if (userIds.Count > 0)
    //        {
    //            try
    //            {
    //                userDtos = await _userService.GetUsersByIds(userIds);
    //            }
    //            catch
    //            {
    //                // Bỏ qua lỗi → userDtos = empty
    //            }
    //        }

    //        if (userDtos != null && userDtos.Count > 0)
    //        {
    //            foreach (var post in postDtos)
    //            {
    //                post.User = userDtos.FirstOrDefault(u => u.Id == post.UserId.ToString());
    //            }
    //        }
    //    }



    //    int totalItems = await _unitOfWork.Post.CountAsync(query);

    //    _response.Result = postDtos;
    //    _response.Pagination = new PaginationDto
    //    {
    //        TotalItems = totalItems,
    //        TotalItemsPerPage = queryParameters.PageSize,
    //        CurrentPage = queryParameters.PageNumber,
    //        TotalPages = (int)Math.Ceiling((double)totalItems / queryParameters.PageSize)
    //    };

    //    return Ok(_response);
    //}

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

    [HttpGet("me/following")]
    [Authorize]
    public async Task<ActionResult<ResponseDto>> GetFollowedPosts([FromQuery] PostQueryParameters? queryParameters)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }

        var followerQuery = new QueryParameters<Follower>();
        followerQuery.Filters.Add(f => f.UserId == userId);

        var followers = await _unitOfWork.Follower.GetAllAsync(followerQuery);
        var postIds = followers.Select(f => f.PostId).Distinct().ToList();

        if (!postIds.Any())
        {
            _response.Result = new List<PostDto>();
            _response.Pagination = new PaginationDto
            {
                TotalItems = 0,
                TotalItemsPerPage = queryParameters.PageSize,
                CurrentPage = queryParameters.PageNumber,
                TotalPages = 0
            };
            return Ok(_response);
        }


        var query = PostFeatures.Build(queryParameters);
        query.IncludeProperties = "Category,PostImages";
        query.Filters.Add(p => postIds.Contains(p.PostId) && p.UserId != userId && p.PostStatus == PostStatus.Approved);

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
            post = await _unitOfWork.Post.GetAsync(c => c.PostId == id, includeProperties: "Category,PostImages");
        }
        else
        {
            post = await _unitOfWork.Post.GetAsync(c => c.PostId == id && c.PostStatus == PostStatus.Approved, includeProperties: "Category,PostImages");
        }

        if (post == null)
        {
            throw new PostNotFoundException(id);
        }

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

        _response.Result = _mapper.Map<PostDto>(post);

        return Ok(_response);
    }

    [HttpGet]
    [Route("by-slug/{slug}")]
    public async Task<ActionResult<ResponseDto>> GetBySlug(string slug)
    {
        var post = await _unitOfWork.Post.GetAsync(c => c.Slug == slug, includeProperties: "Category,PostImages");

        if (post == null)
        {
            throw new PostNotFoundException(slug);
        }

        bool isAdmin = User.IsInRole(SD.AdminRole);

        //var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (isAdmin || post.UserId.ToString() == userId)
        {

        }
        else
        {
            if (post.PostStatus != PostStatus.Approved)
                throw new PostNotFoundException(slug);
        }

        _response.Result = _mapper.Map<PostDto>(post);

        return Ok(_response);
    }

    [HttpGet("by-slug-with-user/{slug}")]
    public async Task<ActionResult<ResponseDto>> GetBySlugWithUser(string slug)
    {
        //bool isAdmin = User.IsInRole(SD.AdminRole);

        var post = await _unitOfWork.Post.GetAsync(
                  p => p.Slug == slug,
                  includeProperties: "Category,PostImages");


        if (post == null)
            throw new PostNotFoundException(slug);

        List<UserDto> userDtos = new();
        try
        {
            userDtos = await _userService.GetUsersByIds(new[] { post.UserId.ToString() });
        }
        catch
        {
            // Bỏ qua lỗi → userDtos = empty
        }

        // --- Lấy thông tin tác giả ---
        var author = userDtos.FirstOrDefault();

        var postDto = _mapper.Map<PostDto>(post);
        postDto.User = author;

        _response.Result = postDto;
        return Ok(_response);
    }

    [HttpGet("by-id-with-user/{id}")]
    public async Task<ActionResult<ResponseDto>> GetByIdWithUser(Guid id)
    {
        //bool isAdmin = User.IsInRole(SD.AdminRole);

        var post = await _unitOfWork.Post.GetAsync(
                  p => p.PostId == id,
                  includeProperties: "Category,PostImages");


        if (post == null)
            throw new PostNotFoundException(id);

        List<UserDto> userDtos = new();
        try
        {
            userDtos = await _userService.GetUsersByIds(new[] { post.UserId.ToString() });
        }
        catch
        {
            // Bỏ qua lỗi → userDtos = empty
        }

        // --- Lấy thông tin tác giả ---
        var author = userDtos.FirstOrDefault();

        var postDto = _mapper.Map<PostDto>(post);
        postDto.User = author;

        _response.Result = postDto;
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

        Post post = _mapper.Map<Post>(postDto);
        post.PostStatus = PostStatus.Pending;
        post.UserId = userId;

        // check post type fee
        if (postDto.PostLabel == PostLabel.Priority)
        {
            // trừ tiền
            var fee = await _unitOfWork.PostSetting.GetAsync(p => p.Name == nameof(SD.PostLabel_Priority_Price));
            var priorityDays = await _unitOfWork.PostSetting.GetAsync(p => p.Name == nameof(SD.Priority_Days));

            if (fee == null || priorityDays == null)
            {
                throw new NotFoundException("Not found fee / priority days");
            }

            if (!decimal.TryParse(fee.Value, out var feeAmount))
            {
                throw new BadRequestException("Invalid fee value format");
            }

            if (!int.TryParse(priorityDays.Value, out var priorityDaysValue))
            {
                throw new BadRequestException("Invalid priorityDays value format");
            }


            await _paymentService.SubtractBalance(feeAmount);
            post.PostLabel = PostLabel.Priority;
            post.PriorityDays = priorityDaysValue;
            post.Price = feeAmount;
        }
        else
        {
            post.PostLabel = PostLabel.Normal;
            post.Price = 0;
        }


        // Generate slug
        post.Slug = SlugGenerator.CreateUniqueSlugAsync(post.Title);

        await _unitOfWork.Post.AddAsync(post);

        if (postDto.ImageFiles == null || !(postDto.ImageFiles.Any()))
        {
            throw new BadRequestException("Post require images");
        }

        // upload images to Cloudinary
        int i = 0;
        if (postDto.ThumbnailIndex >= postDto.ImageFiles.Count || postDto.ThumbnailIndex < 0)
            postDto.ThumbnailIndex = 0;

        foreach (var imgDto in postDto.ImageFiles)
        {
            var imageResult = await _imageUploader.UploadImageAsync(imgDto);
            if (!imageResult.IsSuccess)
            {
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
            UserId = userId,
            IsSubscribed = true,
        });

        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<PostDto>(post);

        return CreatedAtAction(nameof(GetById), new { id = post.PostId }, _response);
    }


    [HttpPut]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<ResponseDto>> Put([FromForm] PostUpdateDto postDto)
    {
        Post postFromDb = await _unitOfWork.Post.GetAsync(c => c.PostId == postDto.PostId);
        if (postFromDb == null)
        {
            throw new PostNotFoundException(postDto.PostId);
        }

        if (postFromDb.PostStatus != PostStatus.Pending && postFromDb.PostStatus != PostStatus.Rejected)
            throw new BadRequestException("Can't update post status different pending/rejected");

        // Cập nhật các thuộc tính của movieFromDb từ movieDto
        _mapper.Map(postDto, postFromDb);

        // check post type fee
        if (postDto.PostLabel == PostLabel.Priority && postFromDb.PostLabel == PostLabel.Normal)
        {
            // trừ tiền
            var fee = await _unitOfWork.PostSetting.GetAsync(p => p.Name == nameof(SD.PostLabel_Priority_Price));
            var priorityDays = await _unitOfWork.PostSetting.GetAsync(p => p.Name == nameof(SD.Priority_Days));

            if (fee == null || priorityDays == null)
            {
                throw new NotFoundException("Not found fee / priority days");
            }

            if (!decimal.TryParse(fee.Value, out var feeAmount))
            {
                throw new BadRequestException("Invalid fee value format");
            }

            if (!int.TryParse(priorityDays.Value, out var priorityDaysValue))
            {
                throw new BadRequestException("Invalid priorityDays value format");
            }

            await _paymentService.SubtractBalance(feeAmount);
            postFromDb.PostLabel = PostLabel.Priority;
            postFromDb.PriorityDays = priorityDaysValue;
            postFromDb.Price = feeAmount;
        }
        else if (postFromDb.PostLabel == PostLabel.Priority && postDto.PostLabel == PostLabel.Normal)
        {
            throw new BadRequestException("Can't update post from Priority to Normal");
        }


        postFromDb.Slug = SlugGenerator.CreateUniqueSlugAsync(postDto.Title);
        postFromDb.PostStatus = PostStatus.Pending;


        await _unitOfWork.Post.UpdateAsync(postFromDb);

        //xử lý ảnh
        var queryImage = new QueryParameters<PostImage>();
        queryImage.Filters.Add(img => img.PostId == postDto.PostId);

        var oldImgs = await _unitOfWork.PostImage
            .GetAllAsync(queryImage);


        // xóa ảnh cũ
        foreach (var img in oldImgs)
        {
            var result = await _imageUploader.DeleteImageAsync(img.PublicId);
            try
            {
                await _unitOfWork.PostImage.RemoveAsync(img);
            }
            catch (Exception ex)
            {
                throw new BadRequestException("Delete image failed.");
            }
        }

        //  upload ảnh mới
        int i = 0;
        if (postDto.ThumbnailIndex >= postDto.ImageFiles.Count || postDto.ThumbnailIndex < 0)
            postDto.ThumbnailIndex = 0;

        foreach (var imgDto in postDto.ImageFiles)
        {
            var imageResult = await _imageUploader.UploadImageAsync(imgDto);
            if (!imageResult.IsSuccess)
            {
                throw new BadRequestException(imageResult.ErrorMessage);
            }

            var postImage = new PostImage
            {
                PostId = postFromDb.PostId,
                ImageUrl = imageResult.Url,
                PublicId = imageResult.PublicId,
            };
            await _unitOfWork.PostImage.AddAsync(postImage);

            if (i == postDto.ThumbnailIndex)
                postFromDb.ThumbnailUrl = imageResult.Url;

            i++;
        }


        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<PostDto>(postFromDb);

        return Ok(_response);
    }


    [HttpPut("upgrade-priority-post/{postId}")]
    public async Task<ActionResult<ResponseDto>> UpgradePriorityPost(Guid postId)
    {
        var postFromDb = await _unitOfWork.Post.GetAsync(p => p.PostId == postId);
        if (postFromDb == null)
            throw new PostNotFoundException(postId);

        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }

        if(postFromDb.UserId != userId)
        {
            throw new ForbiddenException();
        }

        if (postFromDb.PostStatus != PostStatus.Approved)
        {
            throw new BadRequestException("The post has not been approved yet.");
        }

        if (postFromDb.PostLabel == PostLabel.Priority) {
            throw new BadRequestException("The post is already marked as Priority.");
        }


        // trừ tiền
        var fee = await _unitOfWork.PostSetting.GetAsync(p => p.Name == nameof(SD.PostLabel_Priority_Price));
        var priorityDays = await _unitOfWork.PostSetting.GetAsync(p => p.Name == nameof(SD.Priority_Days));

        if (fee == null || priorityDays == null)
        {
            throw new NotFoundException("Not found fee / priority days");
        }

        if (!decimal.TryParse(fee.Value, out var feeAmount))
        {
            throw new BadRequestException("Invalid fee value format");
        }

        if (!int.TryParse(priorityDays.Value, out var priorityDaysValue))
        {
            throw new BadRequestException("Invalid priorityDays value format");
        }

        await _paymentService.SubtractBalance(feeAmount);
        postFromDb.PostLabel = PostLabel.Priority;
        postFromDb.PriorityDays = priorityDaysValue;
        postFromDb.PriorityStartAt = DateTime.Now;
        postFromDb.Price = feeAmount;

        await _unitOfWork.Post.UpdateAsync(postFromDb);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<PostDto>(postFromDb);

        return Ok(_response);
    }

    [HttpPut("post-label-status")]
    [Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> UpdatePostUpdateLabelAndStatus([FromBody] PostUpdateLabelAndStatus postDto)
    {
        var postFromDb = await _unitOfWork.Post.GetAsync(c => c.PostId == postDto.PostId);
        if (postFromDb == null)
            throw new PostNotFoundException(postDto.PostId);

        // Admin chỉ update, không trừ tiền

        if (postDto.PostLabel.HasValue)
        {
            if (postFromDb.PostLabel == postDto.PostLabel.Value)
                throw new BadRequestException($"PostLabel is already {postDto.PostLabel.Value}");

            postFromDb.PostLabel = postDto.PostLabel.Value;

            if (postDto.PostLabel == PostLabel.Priority)
            {
                var priorityDaysSetting = await _unitOfWork.PostSetting.GetAsync(p => p.Name == nameof(SD.Priority_Days));

                if (!int.TryParse(priorityDaysSetting?.Value, out var priorityDaysValue))
                    throw new BadRequestException("Invalid priorityDays value format");

                postFromDb.PriorityDays = priorityDaysValue;

                // Nếu đã duyệt rồi thì bắt đầu đếm ngày
                if (postFromDb.PostStatus == PostStatus.Approved)
                    postFromDb.PriorityStartAt = DateTime.Now;
                else
                    postFromDb.PriorityStartAt = null; // đợi duyệt rồi mới bắt đầu
            }
            else // nếu đổi về Normal thì clear
            {
                postFromDb.PriorityStartAt = null;
                postFromDb.PriorityDays = null;

                // hoàn tiền
                if (postFromDb.Price > 0)        
                    await _paymentService.Refund(new RefundDto { UserId = postFromDb.UserId, Amount = postFromDb.Price });

                postFromDb.Price = 0;
            }
        }

        if (postDto.PostStatus.HasValue)
        {
            if (postFromDb.PostStatus == postDto.PostStatus.Value)
                throw new BadRequestException($"PostStatus is already {postDto.PostStatus.Value}");

            postFromDb.PostStatus = postDto.PostStatus.Value;

            // Nếu status là Approved và label là Priority thì đặt thời gian bắt đầu ưu tiên
            if (postDto.PostStatus == PostStatus.Approved && postFromDb.PostLabel == PostLabel.Priority)
            {
                postFromDb.PriorityStartAt = DateTime.Now;
            }
        }

        // Lý do bị từ chối
        if (!string.IsNullOrWhiteSpace(postDto.RejectionReason))
        {
            postFromDb.RejectionReason = postDto.RejectionReason;
        }

        await _unitOfWork.Post.UpdateAsync(postFromDb);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<PostDto>(postFromDb);
        return Ok(_response);
    }


    //[HttpPut("post-label-status")]
    ////[Authorize(Roles = SD.AdminRole)]
    //public async Task<ActionResult<ResponseDto>> UpdatePostUpdateLabelAndStatus([FromBody] PostUpdateLabelAndStatus postDto)
    //{
    //    Post postFromDb = await _unitOfWork.Post.GetAsync(c => c.PostId == postDto.PostId);
    //    if (postFromDb == null)
    //        throw new PostNotFoundException(postDto.PostId);

    //    if (postDto.PostLabel.HasValue)
    //    {
    //        postFromDb.PostLabel = postDto.PostLabel.Value;
    //        if(postDto.PostLabel == PostLabel.Priority)
    //        {
    //            var priorityDays = await _unitOfWork.PostSetting.GetAsync(p => p.Name == nameof(SD.Priority_Days));

    //            if (!int.TryParse(priorityDays.Value, out var priorityDaysValue))
    //            {
    //                throw new BadRequestException("Invalid priorityDays value format");
    //            }

    //            postFromDb.PriorityDays = priorityDaysValue;
    //            postFromDb.PriorityStartAt = DateTime.Now;
    //        }
    //    }


    //    if (postDto.PostStatus.HasValue)
    //    {
    //        postFromDb.PostStatus = postDto.PostStatus.Value;

    //        if(postDto.PostStatus == PostStatus.Approved)
    //        {
    //            postFromDb.PriorityStartAt = DateTime.Now;
    //        }
    //    }


    //    if (postDto.RejectionReason != null)
    //        postFromDb.RejectionReason = postDto.RejectionReason;

    //    await _unitOfWork.Post.UpdateAsync(postFromDb);
    //    await _unitOfWork.SaveAsync();

    //    _response.Result = _mapper.Map<PostDto>(postFromDb);

    //    return Ok(_response);
    //}

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult<ResponseDto>> Delete(Guid id)
    {
        var post = await _unitOfWork.Post.GetAsync(c => c.PostId == id);
        if (post == null)
        {
            throw new PostNotFoundException(id);
        }

        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }

        bool isAdmin = User.IsInRole(SD.AdminRole);
        if (!isAdmin && post.UserId != userId)
        {
            throw new ForbiddenException("You are not allowed to access data that does not belong to you.");
        }

        if (post.IsEmbedded)
        {
            throw new BadHttpRequestException("Please remove embedding before removing the post");
        }

        // xóa ảnh trên cloud
        var queryImage = new QueryParameters<PostImage>();
        queryImage.Filters.Add(img => img.PostId == id);

        var existingImages = await _unitOfWork.PostImage
            .GetAllAsync(queryImage);

        foreach (var img in existingImages)
        {
            try
            {
                var result = await _imageUploader.DeleteImageAsync(img.PublicId);
                if (!result.IsSuccess)
                {
                    throw new BadRequestException(result.ErrorMessage);
                }
            }
            catch (Exception)
            {

            }
        }



        if (!isAdmin) {
            if ((post.PostStatus == PostStatus.Rejected || post.PostStatus == PostStatus.Pending) )
            {
                // trả lại tiền
                if (post.Price > 0)
                    await _paymentService.Refund(new RefundDto { UserId = post.UserId, Amount = post.Price });
            }
        }

       

        // xóa post và post images
        await _unitOfWork.Post.RemoveAsync(post);
        await _unitOfWork.SaveAsync();

        return Ok(_response);
    }


    //[HttpPut]
    //[Authorize]
    //public async Task<ActionResult<ResponseDto>> Put([FromBody] PostUpdateDto postDto)
    //{
    //    //if ((!postDto.RetainedImagePublicIds?.Any() ?? true) && (postDto.ImageFiles == null || !postDto.ImageFiles.Any()))
    //    //{
    //    //    throw new BadRequestException("Post must contain at least one image.");
    //    //}

    //    Post postFromDb = await _unitOfWork.Post.GetAsync(c => c.PostId == postDto.PostId);
    //    if (postFromDb == null)
    //    {
    //        throw new PostNotFoundException(postDto.PostId);
    //    }

    //    // Kiểm tra quyền truy cập
    //    //var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
    //    //if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
    //    //{
    //    //    throw new BadRequestException("Invalid or missing user ID claim.");
    //    //}

    //    //bool isAdmin = User.IsInRole(SD.AdminRole);
    //    //if (!isAdmin && postFromDb.UserId != userId)
    //    //{
    //    //    throw new ForbiddenException("You are not allowed to access data that does not belong to you.");
    //    //}


    //    if (postFromDb.PostStatus != PostStatus.Pending)
    //        throw new BadRequestException("Can't update post status different pending");

    //    // check post type fee
    //    if (postDto.PostLabel == PostLabel.Priority && postFromDb.PostLabel == PostLabel.Normal)
    //    {
    //        // trừ tiền
    //        var fee = await _unitOfWork.PostSetting.GetAsync(p => p.Name == nameof(SD.PostLabel_Priority_Price));
    //        if (fee == null)
    //        {
    //            throw new NotFoundException("Not found fee");
    //        }

    //        if (!decimal.TryParse(fee.Value, out var feeAmount))
    //        {
    //            throw new BadRequestException("Invalid fee value format");
    //        }

    //        await _paymentService.SubtractBalance(feeAmount);
    //        postFromDb.PostLabel = PostLabel.Priority;
    //        postFromDb.Price = feeAmount;
    //    }
    //    else
    //    {
    //        postFromDb.PostLabel = PostLabel.Normal;
    //        postFromDb.Price = 0;
    //    }



    //    postFromDb.Slug = SlugGenerator.GenerateSlug(postDto.Title);

    //    // Cập nhật các thuộc tính của movieFromDb từ movieDto
    //    _mapper.Map(postDto, postFromDb);

    //    //xử lý ảnh
    //    var queryImage = new QueryParameters<PostImage>();
    //    queryImage.Filters.Add(img => img.PostId == postDto.PostId);

    //    var existingImages = await _unitOfWork.PostImage
    //        .GetAllAsync(queryImage);

    //    // xóa ảnh cũ 
    //    var imagesToDelete = existingImages
    //                            .Where(img => !postDto.RetainedImagePublicIds.Contains(img.PublicId))
    //                            .ToList();

    //    foreach (var img in imagesToDelete)
    //    {
    //        var result = await _imageUploader.DeleteImageAsync(img.PublicId);
    //        if (result.IsSuccess)
    //        {
    //            await _unitOfWork.PostImage.RemoveAsync(img);
    //        }
    //        else
    //        {
    //            throw new BadRequestException(result.ErrorMessage);
    //        }
    //    }

    //    //  upload ảnh mới
    //    foreach (var imgDto in postDto.ImageFiles)
    //    {
    //        var imageResult = await _imageUploader.UploadImageAsync(imgDto);
    //        if (!imageResult.IsSuccess)
    //            throw new BadRequestException(imageResult.ErrorMessage);

    //        var postImage = new PostImage
    //        {
    //            PostId = postFromDb.PostId,
    //            ImageUrl = imageResult.Url,
    //            PublicId = imageResult.PublicId
    //        };
    //        await _unitOfWork.PostImage.AddAsync(postImage);
    //    }

    //    // update thumbnail
    //    var updatedImages = await _unitOfWork.PostImage.GetAllAsync(queryImage);
    //    if (postDto.ThumbnailIndex < 0 || postDto.ThumbnailIndex >= updatedImages.Count())
    //    {
    //        postDto.ThumbnailIndex = 0;
    //    }

    //    var thumb = updatedImages.ElementAtOrDefault(postDto.ThumbnailIndex);
    //    postFromDb.ThumbnailUrl = thumb?.ImageUrl;


    //    await _unitOfWork.Post.UpdateAsync(postFromDb);
    //    await _unitOfWork.SaveAsync();

    //    _response.Result = _mapper.Map<PostDto>(postFromDb);

    //    return Ok(_response);
    //}
}

