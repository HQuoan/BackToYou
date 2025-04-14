namespace PostAPI.Models.Dtos;

public class PostImageDto
{
    public Guid PostImageId { get; set; }
    public Guid PostId { get; set; }
    public string ImageUrl { get; set; }
    public bool IsThumbnail { get; set; } = false;
}
