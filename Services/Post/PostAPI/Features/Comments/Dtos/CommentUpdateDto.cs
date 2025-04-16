namespace PostAPI.Features.Comments.Dtos;

public class CommentUpdateDto
{
    public Guid CommentId { get; set; }
    public Guid? CommentParentId { get; set; }
    public Guid PostId { get; set; }
    public string Description { get; set; }
}
