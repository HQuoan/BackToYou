namespace PostAPI.Features.Posts.Dtos;

public class ImageFileValidator : AbstractValidator<IFormFile>
{
    private static readonly string[] AllowedTypes = { "image/jpeg", "image/png", "image/jpg", "image/webp" };

    public ImageFileValidator()
    {
        RuleFor(f => f.ContentType.ToLower())
            .Must(type => AllowedTypes.Contains(type))
            .WithMessage(f => $"The file '{f.FileName}' is not a valid image format.");
    }
}