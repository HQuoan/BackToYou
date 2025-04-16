namespace PostAPI.Features.Comments.Queries;

public class CommentQueryParameters : BaseQueryParameters
{
    public Guid? CommentParentId { get; set; }
    public Guid? UserId { get; set; }
    public Guid? PostId { get; set; }
    public string? Description { get; set; }
}
