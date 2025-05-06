namespace PostAPI.Features.Locations.Repositories;
public class WardRepository : Repository<Ward>, IWardRepository
{
    public WardRepository(AppDbContext db) : base(db)
    {
    }
}

