using BuildingBlocks.Models;
using System.ComponentModel.DataAnnotations;

namespace Post.API.Models;

public class Category : BaseEntity
{
    [Key]
    public Guid CategoryId { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public string Slug { get; set; }
}
