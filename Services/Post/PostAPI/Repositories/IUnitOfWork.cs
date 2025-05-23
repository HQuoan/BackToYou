using PostAPI.Features.Categories;
using PostAPI.Features.Comments;
using PostAPI.Features.Followers;
using PostAPI.Features.PostImages;
using PostAPI.Features.PostSettings;
using PostAPI.Features.Posts;
using PostAPI.Features.Locations.Repositories;
using PostAPI.Features.Reports;

namespace PostAPI.Repositories;

public interface IUnitOfWork
{
    ICategoryRepository Category { get; }
    IPostRepository Post { get; }
    IPostSettingRepository PostSetting { get; }
    IPostImageRepository PostImage { get; }
    ICommentRepository Comment { get; }
    IFollowerRepository Follower { get; }
    IReportRepository Report { get; }

    IProvinceRepository Province { get; }
    IDistrictRepository District { get; }
    IWardRepository Ward { get; }

    Task SaveAsync();
}
