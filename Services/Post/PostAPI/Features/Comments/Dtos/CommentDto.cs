namespace PostAPI.Features.Comments.Dtos;

public class CommentDto : BaseEntity
{
    public Guid CommentId { get; set; }
    public Guid? ParentCommentId { get; set; }
    public Guid UserId { get; set; }
    public Guid PostId { get; set; }
    public string Description { get; set; }
    public ICollection<CommentDto>? ChildComments { get; set; }
}
