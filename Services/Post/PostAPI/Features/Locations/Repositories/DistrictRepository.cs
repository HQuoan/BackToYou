namespace PostAPI.Features.Locations.Repositories;
public class DistrictRepository : Repository<District>, IDistrictRepository
{
    public DistrictRepository(AppDbContext db) : base(db)
    {
    }
}

