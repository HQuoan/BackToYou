using PostAPI.Features.Categories;
using PostAPI.Features.Comments;
using PostAPI.Features.Followers;
using PostAPI.Features.PostImages;
using PostAPI.Features.Posts;

namespace PostAPI.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _db;
    public ICategoryRepository Category { get; private set; }
    public IPostRepository Post { get; private set; }
    public IPostImageRepository PostImage { get; private set; }
    public ICommentRepository Comment { get; private set; }
    public IFollowerRepository Follower { get; private set; }

    public UnitOfWork(AppDbContext db)
    {
        _db = db;
        Category = new CategoryRepository(_db);
        Post = new PostRepository(_db);
        PostImage = new PostImageRepository(_db);
        Comment = new CommentRepository(_db);
        Follower = new FollowerRepository(_db);
    }
    public async Task SaveAsync()
    {
        await _db.SaveChangesAsync();
    }
}
