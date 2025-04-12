using BuildingBlocks.Models;
using System.ComponentModel.DataAnnotations;

namespace Post.API.Models;

public class Category : BaseEntity
{
    [Key]
    public int CategoryId { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public string Slug { get; set; }
    public bool Status { get; set; } = true;
}
