namespace PostAPI.Features.Comments.Dtos;

public class CommentUpdateDto
{
    public Guid CommentId { get; set; }
    public string Description { get; set; }
}


public class CommentUpdateDtoValidator : AbstractValidator<CommentUpdateDto>
{
    public CommentUpdateDtoValidator()
    {
        RuleFor(x => x.CommentId).NotEmpty();
        RuleFor(x => x.Description).NotEmpty();
    }
}
