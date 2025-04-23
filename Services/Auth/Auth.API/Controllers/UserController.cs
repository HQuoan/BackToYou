using Auth.API.Exceptions;
using BuildingBlocks.Extensions;
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

    public UserController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IMapper mapper, AppDbContext db)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _mapper = mapper;
        _db = db;
        _response = new();
    }

    [HttpGet]
   // [Authorize(Roles = SD.AdminRole)]
    public async Task<IActionResult> Get([FromQuery] UserQueryParameters queryParameters)
    {
        // Build query parameters
        var query = UserFeatures.Build(queryParameters);

        // Apply filters, sorting, and pagination (exclude Role)
        var queryableUsers = _db.ApplicationUsers.AsQueryable();

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

        // Retrieve total items before pagination
        var totalItemsBeforePagination = queryableUsers.Count();

        var users = await queryableUsers
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();

        // Retrieve roles for each user
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            user.Role = string.Join(", ", roles);
        }

        // Filter by Role (in-memory)
        if (!string.IsNullOrEmpty(queryParameters.Role))
        {
            users = users
                .Where(u => u.Role.ToLower().Contains(queryParameters.Role.ToLower()))
                .ToList();
        }

        // Sort by Role (in-memory)
        if (!string.IsNullOrEmpty(queryParameters.OrderBy))
        {
            var isDescending = queryParameters.OrderBy.StartsWith("-");
            var property = isDescending ? queryParameters.OrderBy.Substring(1) : queryParameters.OrderBy;

            if (property.ToLower() == "role")
            {
                users = isDescending
                    ? users.OrderByDescending(u => u.Role).ToList()
                    : users.OrderBy(u => u.Role).ToList();
            }
        }

        // Calculate pagination details
        var totalFilteredItems = users.Count; // Count after Role filter
        var paginatedUsers = users
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToList();

        // Map to DTO
        _response.Result = _mapper.Map<IEnumerable<UserDto>>(paginatedUsers);
        _response.Pagination = new PaginationDto
        {
            TotalItems = totalFilteredItems,
            TotalItemsPerPage = queryParameters.PageSize,
            CurrentPage = queryParameters.PageNumber,
            TotalPages = (int)Math.Ceiling((double)totalFilteredItems / queryParameters.PageSize)
        };

        return Ok(_response);
    }

    [HttpGet("GetById")]
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

    [HttpGet("GetByEmail/{email}")]
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

    [HttpPut("UpdateInformation")]
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
        user.Avatar = userInformation.Avatar;
        user.Sex = userInformation.Sex;
        user.DateOfBirth = userInformation.DateOfBirth;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
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

    [HttpPost("UploadAvatar")]
    [Authorize]
    public async Task<IActionResult> UploadAvatar(IFormFile file, string pictureName, string? folder = null)
    {
       
        return Ok(_response);
    }

}
