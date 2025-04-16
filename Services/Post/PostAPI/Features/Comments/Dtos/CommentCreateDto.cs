namespace PostAPI.Features.Comments.Dtos;

public class CommentCreateDto
{
    public Guid? CommentParentId { get; set; }
    public Guid PostId { get; set; }
    public string Description { get; set; }
}
