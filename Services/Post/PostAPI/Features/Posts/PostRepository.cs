using BuildingBlocks.Repositories;

namespace PostAPI.Features.Posts;

public class PostRepository : Repository<Post>, IPostRepository
{
    public PostRepository(AppDbContext db) : base(db)
    {
    }
}
