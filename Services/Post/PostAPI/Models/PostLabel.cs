namespace PostAPI.Models;

public class PostLabel
{
    [Key]
    public Guid PostLabelId { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public decimal Price { get; set; } = 0;
    public ICollection<PostLabel> PostLabels { get; set; }
}
