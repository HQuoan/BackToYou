﻿using Auth.API.Exceptions;
using BuildingBlocks.Extensions;
using ImageService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Auth.API.Controllers;
[Route("users")]
[ApiController]
public class UserController : ControllerBase
{
    protected ResponseDto _response;
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IImageUploader _imageUploader;
    private readonly IWalletService _walletService;

    public UserController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IMapper mapper, AppDbContext db, IImageUploader imageUploader, IWalletService walletService)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _mapper = mapper;
        _db = db;
        _response = new();
        _imageUploader = imageUploader;
        _walletService = walletService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Get([FromQuery] UserQueryParameters queryParameters)
    {
        var query = UserFeatures.Build(queryParameters);
        var queryableUsers = _db.ApplicationUsers.AsQueryable();

        // Filter bằng EF Core (ngoại trừ Role)
        if (query.Filters != null && query.Filters.Any())
        {
            foreach (var filter in query.Filters)
            {
                queryableUsers = queryableUsers.Where(filter);
            }
        }

        if (query.OrderBy != null)
        {
            queryableUsers = query.OrderBy(queryableUsers);
        }

        var users = await queryableUsers.ToListAsync();

        // Gán Role cho từng user
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            user.Role = string.Join(", ", roles);
        }

        // Filter Role (in-memory)
        if (!string.IsNullOrEmpty(queryParameters.Role))
        {
            users = users
                .Where(u => u.Role != null &&
                            u.Role.ToLower().Contains(queryParameters.Role.ToLower()))
                .ToList();
        }

        // Sort theo Role (in-memory)
        var isDescending = queryParameters.OrderBy?.StartsWith("-") == true;
        var property = isDescending ? queryParameters.OrderBy.Substring(1) : queryParameters.OrderBy;

        if (property?.ToLower() == "role")
        {
            users = isDescending
                ? users.OrderByDescending(u => u.Role).ToList()
                : users.OrderBy(u => u.Role).ToList();
        }

        // Phân trang
        var totalFilteredItems = users.Count;
        var paginatedUsers = users
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToList();


        // Map to DTO
        var userDtos = _mapper.Map<IEnumerable<UserDto>>(paginatedUsers);

        List<Guid> userIds = null;

        userIds = userDtos.Select(u => Guid.Parse(u.Id)).Distinct().ToList();
        var wallets = await _walletService.GetWallets(userIds);

        // Gán thông tin wallet vào từng user
        if (wallets != null && wallets.Count > 0)
        {
            var walletDict = wallets.ToDictionary(u => u.UserId.ToString());

            foreach (var item in userDtos)
            {
                if (walletDict.TryGetValue(item.Id, out var wallet))
                {
                    item.Wallet = wallet;
                }
            }
        }


        _response.Result = userDtos;
        _response.Pagination = new PaginationDto
        {
            TotalItems = totalFilteredItems,
            TotalItemsPerPage = query.PageSize,
            CurrentPage = query.PageNumber,
            TotalPages = (int)Math.Ceiling((double)totalFilteredItems / query.PageSize)
        };

        return Ok(_response);
    }


    [HttpGet("new-user-count/{lastDay}")]
    public async Task<IActionResult> GetNewUserCount(int lastDay = 7)
    {
        if (lastDay <= 0) lastDay = 7;

        var today = DateTime.Now;
        var startDate = today.Date.AddDays(-lastDay + 1); // Bao gồm cả ngày hôm nay
        var endDate = today.Date.AddDays(1).AddTicks(-1); // Tới 23:59:59.999...

        var userCount = await _db.ApplicationUsers.Where(u => u.CreatedAt >= startDate && u.CreatedAt <= endDate).CountAsync();

        _response.Result = new
        {
            UserCount = userCount,
        };

        return Ok(_response);
    }

    [HttpGet("get-by-id")]
    [Authorize]
    public async Task<IActionResult> GetById([FromQuery] string? id)
    {
        // Lấy userId từ claim
        string userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        // Xác định ID sẽ sử dụng
        string targetId = id ?? userId;

        if (targetId == null)
        {
            throw new BadRequestException("Please fill out id or log in.");
        }

        // Kiểm tra quyền truy cập
        if (!User.IsInRole(SD.AdminRole) && targetId != userId)
        {
            throw new ForbiddenException("You are not allowed to access data that does not belong to you.");
        }

        // Tìm người dùng theo targetId
        var user = await _userManager.FindByIdAsync(targetId);
        if (user == null)
        {
            throw new UserNotFoundException(targetId);
        }

        // Lấy vai trò của user
        var roles = await _userManager.GetRolesAsync(user);
        user.Role = string.Join(", ", roles);

        // Ánh xạ sang DTO
        _response.Result = _mapper.Map<UserDto>(user);

        return Ok(_response);
    }

    [HttpPost("get-by-ids")]
    //[Authorize(Roles = SD.AdminRole)]
    public async Task<IActionResult> GetByIds([FromBody] IEnumerable<string> ids)
    {
        if (ids == null || !ids.Any())
            throw new BadRequestException("List of user ids is empty.");

        var users = await _userManager.Users
                          .Where(u => ids.Contains(u.Id))
                          .ToListAsync();

        if (!users.Any())
            throw new UserNotFoundException(string.Join(", ", ids));

        var userDtos = _mapper.Map<List<UserDto>>(users);

        _response.Result = userDtos;
        return Ok(_response);
    }


    [HttpGet("get-by-email/{email}")]
    [Authorize]
    public async Task<IActionResult> GetByEmail(string email)
    {
        string userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

        if (!User.IsInRole(SD.AdminRole) && (userEmail != null && userEmail != email))
        {
            throw new ForbiddenException("You are not allowed to access data that does not belong to you.");
        }

        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            throw new NotFoundException(email);
        }

        var roles = await _userManager.GetRolesAsync(user);
        user.Role = string.Join(", ", roles);

        _response.Result = _mapper.Map<UserDto>(user);

        return Ok(_response);
    }

    [HttpGet("search-by-email/{keyword}")]
    public async Task<IActionResult> SearchByEmail(string keyword)
    {
        if (string.IsNullOrWhiteSpace(keyword))
            throw new BadRequestException("Keyword is required");

        // Lấy danh sách user
        var users = await _userManager.Users
                                .Where(u => u.Email.Contains(keyword))
                            .ToListAsync();

        // Lấy role cho từng user
        foreach (var u in users)
            u.Role = string.Join(", ", await _userManager.GetRolesAsync(u));

        _response.Result = _mapper.Map<List<UserDto>>(users);

        return Ok(_response);
    }

    [HttpPut("update-info")]
    [Authorize]
    public async Task<IActionResult> UpdateInformation(UserInformation userInformation)
    {
        string userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        string targetId = userInformation.Id ?? userId;

        if (targetId == null)
        {
            throw new BadRequestException("Please fill out id or log in.");
        }

        // Kiểm tra quyền truy cập
        if (!User.IsInRole(SD.AdminRole) && targetId != userId)
        {
            throw new ForbiddenException("You are not allowed to access data that does not belong to you.");
        }

        // Tìm người dùng theo targetId
        var user = await _userManager.FindByIdAsync(targetId);


        if (user == null)
        {
            throw new UserNotFoundException(userInformation.Id);
        }

        user.FullName = userInformation.FullName;
        user.ShortName = userInformation.FullName.ToShortName();
        user.Sex = userInformation.Sex;
        user.DateOfBirth = userInformation.DateOfBirth;
        user.PhoneNumber = userInformation.PhoneNumber;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            throw new BadRequestException("Update information failed!");
        }

        _response.Result = userInformation;
        return Ok(_response);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = SD.AdminRole)]
    public async Task<IActionResult> Delete(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            throw new UserNotFoundException(id);
        }

        if (user.Email == SD.AdminEmail)
        {
            throw new BadRequestException("You cannot delete for this account.");
        }

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return NoContent();
    }

    [HttpPut("upload-avatar")]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadAvatar([FromForm] UploadAvatarDto dto)
    {
        string userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            throw new BadRequestException("Invalid or missing user ID claim.");

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            throw new UserNotFoundException(userId);


        if (user.Avatar != null)
        {
            var publicId = Util.GetPublicIdFromUrl(user.Avatar);
            if (!string.IsNullOrEmpty(publicId))
            {
                var a = await _imageUploader.DeleteImageAsync($"avatar/{publicId}");
            }
        }


        var imageResult = await _imageUploader.UploadImageAsync(dto.Avatar);

        if (!imageResult.IsSuccess)
            throw new BadRequestException(imageResult.ErrorMessage);

      

        user.Avatar = imageResult.Url;
        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
            throw new BadRequestException("Update information failed!");

        _response.Result = imageResult.Url;


        return Ok(_response);
    }
}
