using System.ComponentModel.DataAnnotations.Schema;

namespace PostAPI.Models;

public class Post : BaseEntity
{
    [Key]
    public Guid PostId { get; set; } 
    [Required]
    public Guid UserId { get; set; }
    [Required]
    public Guid CategoryId { get; set; }
    [ForeignKey(nameof(CategoryId))]
    public Category Category { get; set; }
    [Required]
    public string Title { get; set; }
    public string Slug { get; set; }
    [Required]
    public string ThumbnailUrl { get; set; }
    [Required]
    public string Description { get; set; }
    public Location Location { get; set; }
    public PostLabel PostLabel { get; set; } = PostLabel.Normal;
    public PostType PostType { get; set; }
    public PostStatus PostStatus { get; set; } = PostStatus.Pending;
    public decimal Price { get; set; } = decimal.Zero;

    public ICollection<PostImage> PostImages { get; set; }
    public ICollection<Comment> Comments { get; set; }  
    public ICollection<Follower> Followers { get; set; }
}
