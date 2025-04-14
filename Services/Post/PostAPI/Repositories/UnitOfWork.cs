using PostAPI.Repositories.IRepositories;

namespace PostAPI.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _db;
    public ICategoryRepository Category { get; private set; }

    public UnitOfWork(AppDbContext db)
    {
        _db = db;
        Category = new CategoryRepository(_db);
    }
    public async Task SaveAsync()
    {
        await _db.SaveChangesAsync();
    }
}
