namespace PostAPI.Features.PostImages;
public class PostImageRepository : Repository<PostImage>, IPostImageRepository
{
    public PostImageRepository(AppDbContext db) : base(db)
    {
    }
}

