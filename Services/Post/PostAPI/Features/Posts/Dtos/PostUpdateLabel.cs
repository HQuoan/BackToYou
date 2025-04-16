namespace PostAPI.Features.Posts.Dtos;

public class PostUpdateLabel
{
    public Guid PostId { get; set; }
    public Guid PostLabelId { get; set; }
}
