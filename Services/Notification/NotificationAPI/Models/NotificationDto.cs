namespace NotificationAPI.Models;

public class NotificationDto: BaseEntity
{
    public Guid NotificationId { get; set; }
    public Guid UserId { get; set; }
    public string Title { get; set; }
    public string Message { get; set; }
    public string? Data { get; set; }
    public string? Url { get; set; }
    public bool IsRead { get; set; } = false;
}
