using PostAPI.Features.Categories.Dtos;

namespace PostAPI.Features.Posts.Dtos;
public class PostDto : BaseEntity
{
    public Guid PostId { get; set; }
    public Guid UserId { get; set; }
    public Guid CategoryId { get; set; }
    public CategoryDto? Category { get; set; }
    public string Title { get; set; }
    public string Slug { get; set; }
    public string ThumbnailUrl { get; set; }
    public string Description { get; set; }
    public Location Location { get; set; }
    public PostType PostType { get; set; }
    public PostLabel PostLabel { get; set; } 
    public PostStatus PostStatus { get; set; }

    public ICollection<PostImageDto>? PostImages { get; set; }
    public ICollection<CommentDto>? Comments { get; set; }
}
