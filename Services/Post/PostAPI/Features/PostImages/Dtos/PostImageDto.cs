namespace PostAPI.Features.PostImages.Dtos;

public class PostImageDto
{
    public Guid PostImageId { get; set; }
    public Guid PostId { get; set; }
    public string ImageUrl { get; set; }
    public string PublicId { get; set; }
}
