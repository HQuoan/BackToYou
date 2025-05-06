namespace PostAPI.Features.Locations.Repositories;
public class ProvinceRepository : Repository<Province>, IProvinceRepository
{
    public ProvinceRepository(AppDbContext db) : base(db)
    {
    }
}

