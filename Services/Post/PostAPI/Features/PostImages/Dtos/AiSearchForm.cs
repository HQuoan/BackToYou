namespace PostAPI.Features.PostImages.Dtos;

public class AiSearchForm
{
    public IFormFile File { get; set; }
    public string? TextQuery { get; set; }
    public int? Top { get; set; }
}