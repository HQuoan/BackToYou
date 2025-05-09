using System.ComponentModel;

namespace PostAPI.Features.Comments.Dtos;

public class CommentUpdateDto
{
    public Guid CommentId { get; set; }
    public Guid? ParentCommentId { get; set; }
    public Guid PostId { get; set; }
    public string Description { get; set; }
}


public class CommentUpdateDtoValidator : AbstractValidator<CommentUpdateDto>
{
    public CommentUpdateDtoValidator()
    {
        RuleFor(x => x.CommentId).NotEmpty();
        RuleFor(x => x.PostId).NotEmpty();
        RuleFor(x => x.Description).NotEmpty();
    }
}
