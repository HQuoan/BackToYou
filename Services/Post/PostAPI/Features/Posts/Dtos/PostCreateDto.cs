using System.ComponentModel;

namespace PostAPI.Features.Posts.Dtos;
public class PostCreateDto
{
    [DefaultValue("22222222-2222-2222-2222-222222222222")]
    public Guid CategoryId { get; set; }
    [DefaultValue("Tìm đồ")]
    public string Title { get; set; }
    [DefaultValue("Mất đồ")]
    public string Description { get; set; }
    public Location Location { get; set; }
    public PostContact PostContact { get; set; }
    public PostType PostType { get; set; }
    public PostLabel PostLabel { get; set; }
    public DateTime LostOrFoundDate { get; set; }
    public List<IFormFile> ImageFiles { get; set; } = [];
    public int ThumbnailIndex { get; set; } = 0;
}

public class PostCreateDtoValidator : AbstractValidator<PostCreateDto>
{
    public PostCreateDtoValidator()
    {
        RuleFor(x => x.CategoryId).NotEmpty();
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.Description).NotEmpty();
        RuleFor(x => x.ImageFiles)
            .Must(files => files.Count >= 1).WithMessage("At least one image is required.")
            .Must(files => files.Count <= 3).WithMessage("A maximum of 3 images is allowed.");


        RuleFor(x => x.LostOrFoundDate)
            .NotEmpty().WithMessage("Date is required.")
            .LessThanOrEqualTo(DateTime.Now).WithMessage("Date cannot be in the future.")
            .GreaterThan(DateTime.Now.AddMonths(-6)).WithMessage("Date cannot be more than 6 months ago.");


        RuleForEach(x => x.ImageFiles).SetValidator(new ImageFileValidator());

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
