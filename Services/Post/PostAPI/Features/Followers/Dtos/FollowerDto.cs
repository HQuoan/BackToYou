namespace PostAPI.Features.Followers.Dtos;

public class FollowerDto : BaseEntity
{
    public Guid FollowerId { get; set; }
    public Guid UserId { get; set; }
    public Guid PostId { get; set; }
}
