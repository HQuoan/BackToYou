namespace PostAPI.Features.Posts.Queries;

public class CommentQueryParameters : BaseQueryParameters
{
    public Guid? UserId { get; set; }
    public Guid? CategoryId { get; set; }
    public string? Slug { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? Ward { get; set; }
    public string? District { get; set; }
    public string? Province { get; set; }
    public string? StreetAddress { get; set; }
    public PostType? PostType { get; set; }
    public PostLabel? PostLabel { get; set; } 
    public PostStatus? PostStatus { get; set; } 
}
