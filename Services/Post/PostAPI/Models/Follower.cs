namespace PostAPI.Models;

public class Follower : BaseEntity
{
    [Key]
    public Guid FollowerId { get; set; }
    [Required]
    public Guid UserId { get; set; }
    [Required]
    public Guid PostId { get; set; }
    public Post? Post { get; set; }
}
