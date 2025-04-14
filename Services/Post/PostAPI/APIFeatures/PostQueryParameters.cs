namespace PostAPI.APIFeatures;

public class PostQueryParameters : BaseQueryParameters
{
    public Guid? UserId { get; set; }
    public Guid? CategoryId { get; set; }
    public string? Slug { get; set; }
    public Location? Location { get; set; }
    public PostType? PostType { get; set; }
    public PostLabel? PostLabel { get; set; } 
    public PostStatus? PostStatus { get; set; } 
}
