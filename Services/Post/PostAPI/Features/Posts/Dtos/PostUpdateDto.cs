namespace PostAPI.Features.Posts.Dtos;
public class PostUpdateDto
{
    public Guid PostId { get; set; }
    public Guid CategoryId { get; set; }
    public string Title { get; set; }
    public string ThumbnailUrl { get; set; }
    public string Description { get; set; }
    public Location Location { get; set; }
    public PostContact PostContact { get; set; }
    public PostType PostType { get; set; }
    public PostLabel PostLabel { get; set; }
    public DateTime LostOrFoundDate { get; set; }
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

        RuleFor(x => x.LostOrFoundDate)
           .NotEmpty().WithMessage("Date is required.")
           .LessThanOrEqualTo(DateTime.Now).WithMessage("Date cannot be in the future.")
           .GreaterThan(DateTime.Now.AddMonths(-6)).WithMessage("Date cannot be more than 6 months ago.");

        RuleFor(x => x)
            .Must(x =>
                (x.RetainedImagePublicIds != null && x.RetainedImagePublicIds.Any()) ||
                (x.ImageFiles != null && x.ImageFiles.Any()))
            .WithMessage("Post must contain at least one image.");

        When(x => x.ImageFiles != null && x.ImageFiles.Any(), () =>
        {
            RuleForEach(x => x.ImageFiles).SetValidator(new ImageFileValidator());
        });

        RuleFor(x => x.Location).NotNull().WithMessage("Location is required.");
        When(x => x.Location is not null, () =>
        {
            RuleFor(x => x.Location.District)
                .NotEmpty().WithMessage("District is required.");
            RuleFor(x => x.Location.Province)
                .NotEmpty().WithMessage("Province is required.");
        });

        RuleFor(x => x.PostContact).NotNull().WithMessage("Post contact is required.");
        When(x => x.PostContact is not null, () =>
        {
            RuleFor(x => x.PostContact.Name)
                .NotEmpty().WithMessage("Contact name is required.");
            RuleFor(x => x.PostContact.Phone)
                .NotEmpty().WithMessage("Phone number is required.");
            RuleFor(x => x.PostContact.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email format.");
        });
    }
}
