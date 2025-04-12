using BuildingBlocks.Repositories;
using Post.API.Repositories.IRepositories;

namespace Post.API.Repositories;

public class CategoryRepository : Repository<Category>, ICategoryRepository
{
    private readonly AppDbContext _db;

    public CategoryRepository(AppDbContext db) : base(db)
    {
    }
}
