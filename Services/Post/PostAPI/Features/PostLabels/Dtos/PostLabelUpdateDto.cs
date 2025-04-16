namespace PostAPI.Features.PostLabels.Dtos;
public class PostLabelUpdateDto
{
    public Guid PostLabelId { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
}
