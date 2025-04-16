using System.ComponentModel;

namespace PostAPI.Features.Posts.Dtos;
public class PostCreateDto : IValidatableObject
{
    public Guid UserId { get; set; }
    [DefaultValue("227f875a-22e0-4c73-4781-08dd7b3e0244")]
    public Guid CategoryId { get; set; }
    [DefaultValue("Tìm đồ")]
    public string Title { get; set; }
    [DefaultValue("Mất đồ")]
    public string Description { get; set; }
    public Location Location { get; set; }
    public PostType PostType { get; set; }
    [DefaultValue("FA4E6BA0-6A98-4118-AE3D-FADC5EF5EEEA")]
    public Guid PostLabelId { get; set; }
    public List<IFormFile> ImageFiles { get; set; }
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
