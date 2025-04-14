using BuildingBlocks.Repositories;

namespace PostAPI.Features.Posts;

public class PostRepository : Repository<Post>, IPostRepository
{
    private readonly AppDbContext _db;

    public PostRepository(AppDbContext db) : base(db)
    {
    }
}
