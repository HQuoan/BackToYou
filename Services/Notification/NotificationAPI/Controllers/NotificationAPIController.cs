using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NotificationAPI.APIFeatures;
using NotificationAPI.Repositories;
using System.Security.Claims;

namespace NotificationAPI.Controllers;
[Route("notifications")]
[ApiController]
public class NotificationAPIController : ControllerBase
{
    private readonly INotificationRepository _notificationRepo;
    private readonly IMapper _mapper;

    private ResponseDto _response;

    public NotificationAPIController(INotificationRepository notificationRepository, IMapper mapper)
    {
        _notificationRepo = notificationRepository;
        _response = new ResponseDto();
        _mapper = mapper;
    }

    [HttpGet("{userId}")]
    public async Task<ActionResult<ResponseDto>> GetNotificationByUserId(Guid userId)
    {
        var query = new QueryParameters<Notification>();
        query.Filters.Add(c => c.UserId == userId);

        var notifications = await _notificationRepo.GetAllAsync(query);

        _response.Result = _mapper.Map<IEnumerable<NotificationDto>>(notifications);

        return Ok(_response);
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<ResponseDto>> GetReceiptsByMe([FromQuery] NotificationQueryParameters queryParameters)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }

        var query = NotificationFeatures.Build(queryParameters);

        query.Filters.Add(c => c.UserId == userId);

        var notifications = await _notificationRepo.GetAllAsync(query);

        _response.Result = _mapper.Map<IEnumerable<NotificationDto>>(notifications);

        int totalItems = await _notificationRepo.CountAsync(query);
        _response.Pagination = new PaginationDto
        {
            TotalItems = totalItems,
            TotalItemsPerPage = queryParameters.PageSize,
            CurrentPage = queryParameters.PageNumber,
            TotalPages = (int)Math.Ceiling((double)totalItems / queryParameters.PageSize)
        };

        return Ok(_response);
    }

    [HttpPut("mark-as-read/{id}")]
    public async Task<ActionResult<ResponseDto>> MarkAsRead(Guid id)
    {
        var notification = await _notificationRepo.GetAsync(n => n.NotificationId == id);
        if (notification == null)
            throw new NotFoundException("Not found notification");

        notification.IsRead = true;

        await _notificationRepo.UpdateAsync(notification);
        await _notificationRepo.SaveAsync();

        return Ok(_response);
    }
}
