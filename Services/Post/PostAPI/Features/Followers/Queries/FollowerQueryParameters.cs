namespace PostAPI.Features.Followers.Queries;

public class FollowerQueryParameters : BaseQueryParameters
{
    public Guid? UserId { get; set; }
    public Guid? PostId { get; set; }
}
