namespace PostAPI.Models.Dtos;

public class PostImageCreateDto
{
    public string ImageUrl { get; set; }
    public bool IsThumbnail { get; set; } = false;
}
