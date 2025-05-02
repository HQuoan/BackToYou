namespace PostAPI.Features.PostImages.Queries;

public class PostImageQueryParameters : BaseQueryParameters
{
    public Guid? PostId { get; set; }
    public string? ImageUrl { get; set; }
}
