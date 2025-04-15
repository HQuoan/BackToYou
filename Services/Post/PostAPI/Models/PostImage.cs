using System.ComponentModel.DataAnnotations.Schema;

namespace PostAPI.Models;

public class PostImage
{
    [Key]
    public Guid PostImageId { get; set; }
    [Required]
    public Guid PostId { get; set; }
    [ForeignKey(nameof(PostId))]
    public Post? Post { get; set; }
    public string ImageUrl { get; set; }
    //public string? FeatureVector { get; set; } sẽ lưu ở no sql
}
