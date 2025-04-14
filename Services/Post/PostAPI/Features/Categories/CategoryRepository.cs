using BuildingBlocks.Repositories;
namespace PostAPI.Features.Categories;

public class CategoryRepository : Repository<Category>, ICategoryRepository
{
    private readonly AppDbContext _db;

    public CategoryRepository(AppDbContext db) : base(db)
    {
    }
}
