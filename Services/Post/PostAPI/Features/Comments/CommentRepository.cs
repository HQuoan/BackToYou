namespace PostAPI.Features.Comments;

public class CommentRepository : Repository<Comment>, ICommentRepository
{
    public CommentRepository(AppDbContext db) : base(db)
    {
    }
}
