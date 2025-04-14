namespace PostAPI.Features.Posts.Dtos;
public class PostUpdateDto
{
    public Guid PostId { get; set; }
    public Guid UserId { get; set; }
    public Guid CategoryId { get; set; }
    public string Title { get; set; }
    public string Slug { get; set; }
    public string Description { get; set; }
    public Location Location { get; set; }
    public PostType PostType { get; set; }
    public PostLabel PostLabel { get; set; } 
    public PostStatus PostStatus { get; set; }
}
