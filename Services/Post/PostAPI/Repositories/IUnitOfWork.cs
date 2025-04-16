using PostAPI.Features.Categories;
using PostAPI.Features.Comments;
using PostAPI.Features.Followers;
using PostAPI.Features.PostImages;
using PostAPI.Features.PostLabels;
using PostAPI.Features.Posts;

namespace PostAPI.Repositories;

public interface IUnitOfWork
{
    ICategoryRepository Category { get; }
    IPostRepository Post { get; }
    IPostLabelRepository PostLabel { get; }
    IPostImageRepository PostImage { get; }
    ICommentRepository Comment { get; }
    IFollowerRepository Follower { get; }
    Task SaveAsync();
}
