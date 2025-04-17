namespace PostAPI.Features.Posts.Dtos;

public class PostUpdateLabelAndStatus
{
    public Guid PostId { get; set; }
    public PostLabel? PostLabel { get; set; }
    public PostStatus? PostStatus { get; set; }
}
