namespace PostAPI.Features.Posts.Queries;

public class PostQueryParameters : BaseQueryParameters
{
    public Guid? UserId { get; set; }
    public Guid? CategoryId { get; set; }
    public string? CategorySlug { get; set; }
    //public string Title { get; set; }
    //public string Description { get; set; }
    public string? Keyword { get; set; } // Title, Description
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Slug { get; set; }
    public string? StreetAddress { get; set; }
    public string? Ward { get; set; }
    public string? District { get; set; }
    public string? Province { get; set; }
    public TimePeriod? LostOrFoundDate { get; set; }
    public TimePeriod? CreatedAt { get; set; }
    public PostType? PostType { get; set; }
    public PostLabel? PostLabel { get; set; } 
    public PostStatus? PostStatus { get; set; } 
}

