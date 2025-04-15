using PostAPI.Features.Categories;
using PostAPI.Features.Posts;

namespace PostAPI.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _db;
    public ICategoryRepository Category { get; private set; }
    public IPostRepository Post { get; private set; }
    public IPostImageRepository PostImage { get; private set; }

    public UnitOfWork(AppDbContext db)
    {
        _db = db;
        Category = new CategoryRepository(_db);
        Post = new PostRepository(_db);
        PostImage = new PostImageRepository(_db);
    }
    public async Task SaveAsync()
    {
        await _db.SaveChangesAsync();
    }
}
