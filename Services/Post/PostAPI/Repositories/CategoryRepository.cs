using BuildingBlocks.Repositories;
using PostAPI.Repositories.IRepositories;

namespace PostAPI.Repositories;

public class CategoryRepository : Repository<Category>, ICategoryRepository
{
    private readonly AppDbContext _db;

    public CategoryRepository(AppDbContext db) : base(db)
    {
    }
}
