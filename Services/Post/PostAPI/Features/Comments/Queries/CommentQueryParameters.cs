namespace PostAPI.Features.Comments.Queries;

public class CommentQueryParameters : BaseQueryParameters
{
    public Guid? ParentCommentId { get; set; }
    public bool? IsParentCommentNull { get; set; }
    public Guid? UserId { get; set; }
    public Guid? PostId { get; set; }
    public string? Description { get; set; }
}
