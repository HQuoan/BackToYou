namespace PostAPI.Features.PostLabels.Dtos;

public class PostLabelDto
{
    public Guid PostLabelId { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; } = 0;
}
