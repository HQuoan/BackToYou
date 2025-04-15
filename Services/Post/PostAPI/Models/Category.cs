namespace PostAPI.Models;

public class Category : BaseEntity
{
    [Key]
    public Guid CategoryId { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public string Slug { get; set; }

    public ICollection<Post> Posts { get; set; }
}
