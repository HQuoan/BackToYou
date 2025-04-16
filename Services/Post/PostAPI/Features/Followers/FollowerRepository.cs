namespace PostAPI.Features.Followers;

public class FollowerRepository : Repository<Follower>, IFollowerRepository
{
    public FollowerRepository(AppDbContext db) : base(db)
    {
    }
}
