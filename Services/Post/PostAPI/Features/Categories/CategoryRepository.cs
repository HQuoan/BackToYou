namespace PostAPI.Features.Categories;

public class CategoryRepository : Repository<Category>, ICategoryRepository
{
    public CategoryRepository(AppDbContext db) : base(db)
    {
    }
}
