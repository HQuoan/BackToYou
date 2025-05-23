using PostAPI.Features.Categories;
using PostAPI.Features.Comments;
using PostAPI.Features.Followers;
using PostAPI.Features.PostImages;
using PostAPI.Features.PostSettings;
using PostAPI.Features.Posts;
using PostAPI.Features.Locations.Repositories;
using PostAPI.Features.Reports;

namespace PostAPI.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _db;
    public ICategoryRepository Category { get; private set; }
    public IPostRepository Post { get; private set; }
    public IPostSettingRepository PostSetting { get; private set; }
    public IPostImageRepository PostImage { get; private set; }
    public ICommentRepository Comment { get; private set; }
    public IFollowerRepository Follower { get; private set; }
    public IReportRepository Report { get; private set; }

    public IProvinceRepository Province { get; private set; }
    public IDistrictRepository District { get; private set; }
    public IWardRepository Ward { get; private set; }

    public UnitOfWork(AppDbContext db)
    {
        _db = db;
        Category = new CategoryRepository(_db);
        Post = new PostRepository(_db);
        PostImage = new PostImageRepository(_db);
        Comment = new CommentRepository(_db);
        Follower = new FollowerRepository(_db);
        PostSetting = new PostSettingRepository(_db);
        Report = new ReportRepository(_db);

        // Location
        Province = new ProvinceRepository(_db);
        District = new DistrictRepository(_db);
        Ward = new WardRepository(_db);
    }
    public async Task SaveAsync()
    {
        await _db.SaveChangesAsync();
    }
}
