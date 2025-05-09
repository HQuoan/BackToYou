using System.ComponentModel.DataAnnotations.Schema;

namespace PostAPI.Models;

public class Comment : BaseEntity
{
    [Key]
    public Guid CommentId { get; set; }
    public Guid? ParentCommentId { get; set; }
    [ForeignKey(nameof(ParentCommentId))]
    public Comment? ParentComment { get; set; }

    [Required]
    public Guid UserId { get; set; }
    [Required]
    public Guid PostId { get; set; }
    [ForeignKey(nameof(PostId))]
    public Post? Post { get; set; }
    [Required]
    public string Description { get; set; }
}
