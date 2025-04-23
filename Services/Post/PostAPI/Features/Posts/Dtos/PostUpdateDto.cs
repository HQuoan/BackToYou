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
    public PostLabel PostLabel { get; set; }
    public List<string> RetainedImagePublicIds { get; set; } = new();
    public List<IFormFile>? ImageFiles { get; set; }
    public int ThumbnailIndex { get; set; } = 0;
}

public class PostUpdateDtoValidator : AbstractValidator<PostUpdateDto>
{
    public PostUpdateDtoValidator()
    {
        RuleFor(x => x.PostId).NotEmpty();
        RuleFor(x => x.CategoryId).NotEmpty();
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.Description).NotEmpty();

        RuleFor(x => x)
            .Must(x =>
                (x.RetainedImagePublicIds != null && x.RetainedImagePublicIds.Any()) ||
                (x.ImageFiles != null && x.ImageFiles.Any()))
            .WithMessage("Post must contain at least one image.");

        When(x => x.ImageFiles != null && x.ImageFiles.Any(), () =>
        {
            RuleForEach(x => x.ImageFiles).SetValidator(new ImageFileValidator());
        });
    }
}
