using BuildingBlocks.Repositories;

namespace PostAPI.Repositories;
public class PostImageRepository : Repository<PostImage>, IPostImageRepository
{
    public PostImageRepository(AppDbContext db) : base(db)
    {
    }
}

