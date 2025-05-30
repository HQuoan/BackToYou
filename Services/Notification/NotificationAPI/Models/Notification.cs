using System.ComponentModel.DataAnnotations;

namespace NotificationAPI.Models;

public class Notification :BaseEntity
{
    [Key]
    public Guid NotificationId { get; set; }
    public Guid UserId { get; set; } 
    public string Title { get; set; } 
    public string Message { get; set; }
    public string? Url { get; set; }
    public bool IsRead { get; set; } = false;
}
