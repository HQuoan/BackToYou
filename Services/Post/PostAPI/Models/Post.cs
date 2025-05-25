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
    public PostContact PostContact { get; set; }
    
    public PostLabel PostLabel { get; set; } = PostLabel.Normal;
    public PostType PostType { get; set; }
    public PostStatus PostStatus { get; set; } = PostStatus.Pending;
    public DateTime LostOrFoundDate { get; set; } = DateTime.Now;
    public decimal Price { get; set; } = decimal.Zero;
    public string? RejectionReason { get; set; }
    public bool IsEmbedded { get; set; } = false;

    /// <summary>Ngày bắt đầu ưu tiên (null nếu chưa/đã hết ưu tiên)</summary>
    public DateTime? PriorityStartAt { get; set; }

    /// <summary>Số ngày tin được ưu tiên (ví dụ 7 hoặc 30) – dễ gia hạn</summary>
    public int? PriorityDays { get; set; }



    public ICollection<PostImage> PostImages { get; set; }
    public ICollection<Comment> Comments { get; set; }  
    public ICollection<Follower> Followers { get; set; }
}
