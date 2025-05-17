namespace PostAPI.Features.Posts.Dtos;

public class PostUpdateLabelAndStatus
{
    public Guid PostId { get; set; }
    public PostLabel? PostLabel { get; set; }
    public PostStatus? PostStatus { get; set; }
    public string? RejectionReason { get; set; }
}

public class PostUpdateLabelAndStatusValidator : AbstractValidator<PostUpdateLabelAndStatus>
{
    public PostUpdateLabelAndStatusValidator()
    {
        RuleFor(x => x.PostId).NotEmpty();

        RuleFor(x => x)
            .Must(x => x.PostLabel.HasValue || x.PostStatus.HasValue)
            .WithMessage("At least one of PostLabel or PostStatus must be provided.");
    }
}
