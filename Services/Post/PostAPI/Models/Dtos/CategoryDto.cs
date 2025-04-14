using System.ComponentModel.DataAnnotations;

namespace PostAPI.Models.Dtos;

public class CategoryDto
{
    public Guid CategoryId { get; set; }

    [Required]
    public string Name { get; set; }

    public string? Slug { get; set; }
}
