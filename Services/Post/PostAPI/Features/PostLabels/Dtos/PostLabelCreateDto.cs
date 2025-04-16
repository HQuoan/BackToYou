namespace PostAPI.Features.PostLabels.Dtos;
public class PostLabelCreateDto
{
    public string Name { get; set; }
    public decimal Price { get; set; } = 0;
}
