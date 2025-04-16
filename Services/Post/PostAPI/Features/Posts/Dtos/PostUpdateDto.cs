namespace PostAPI.Features.Posts.Dtos;
public class PostUpdateDto
{
    public Guid PostId { get; set; }
    public Guid CategoryId { get; set; }
    public string Title { get; set; }
    public string ThumbnailUrl { get; set; }
    public string Description { get; set; }
    public Location Location { get; set; }
    public PostType PostType { get; set; }
    public PostStatus PostStatus { get; set; }

    public List<string> RetainedImagePublicIds { get; set; } = new();
    public List<IFormFile>? ImageFiles { get; set; }
    public int ThumbnailIndex { get; set; } = 0;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (ImageFiles == null || ImageFiles.Count < 1)
        {
            yield return new ValidationResult("At least one image is required.", new[] { nameof(ImageFiles) });
        }

        if (ImageFiles.Count > 3)
        {
            yield return new ValidationResult("A maximum of 3 images is allowed.", new[] { nameof(ImageFiles) });
        }

        var allowedTypes = new[] { "image/jpeg", "image/png", "image/jpg", "image/webp" };
        foreach (var file in ImageFiles)
        {
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
            {
                yield return new ValidationResult($"The file '{file.FileName}' is not a valid image format.", new[] { nameof(ImageFiles) });
            }
        }
    }
}
