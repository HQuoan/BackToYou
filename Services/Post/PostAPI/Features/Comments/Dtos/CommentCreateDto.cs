namespace PostAPI.Features.Comments.Dtos;

public class CommentCreateDto
{
    public Guid? ParentCommentId { get; set; }
    public Guid PostId { get; set; }
    public string Description { get; set; }
}

public class CommentCreateDtoValidator : AbstractValidator<CommentCreateDto>
{
    public CommentCreateDtoValidator()
    {
        RuleFor(x => x.PostId).NotEmpty();
        RuleFor(x => x.Description).NotEmpty();
    }
}