namespace PostAPI.Models.Dtos;

public class CommentDto : BaseEntity
{
    public Guid CommentId { get; set; }
    public Guid? CommentParentId { get; set; }
    public Guid UserId { get; set; }
    public Guid PostId { get; set; }
    public string Description { get; set; }
}
