namespace PostAPI.Features.PostLabels;

public class PostLabelRepository : Repository<PostLabel>, IPostLabelRepository
{
    public PostLabelRepository(AppDbContext db) : base(db)
    {
    }
}
