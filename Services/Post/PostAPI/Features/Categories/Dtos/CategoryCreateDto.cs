namespace PostAPI.Features.Categories.Dtos;

public class CategoryCreateDto
{
    [Required]
    public string Name { get; set; }
}
