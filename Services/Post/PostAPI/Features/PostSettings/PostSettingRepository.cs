namespace PostAPI.Features.PostSettings;

public class PostSettingRepository : Repository<PostSetting>, IPostSettingRepository
{
    public PostSettingRepository(AppDbContext db) : base(db)
    {
    }
}
