using PostAPI.Features.Comments.Dtos;
using PostAPI.Features.PostImages.Dtos;

namespace PostAPI.Features.Posts.Dtos;
public class PostDto : BaseEntity
{
    public Guid PostId { get; set; }
    public Guid UserId { get; set; }
    public UserDto? User { get; set; }
    public Guid CategoryId { get; set; }
    public CategoryDto? Category { get; set; }
    public string Title { get; set; }
    public string Slug { get; set; }
    public string ThumbnailUrl { get; set; }
    public string Description { get; set; }
    public Location Location { get; set; }
    public PostContact PostContact { get; set; }
    public PostType PostType { get; set; }
    public PostLabel PostLabel { get; set; }
    public PostStatus PostStatus { get; set; }
    public DateTime LostOrFoundDate { get; set; }
    public decimal? Price { get; set; }
    public string? RejectionReason { get; set; }
    public bool IsEmbedded { get; set; }

    public DateTime? PriorityStartAt { get; set; }
    public int? PriorityDays { get; set; }

    public ICollection<PostImageDto>? PostImages { get; set; }
    public ICollection<CommentDto>? Comments { get; set; }
}
