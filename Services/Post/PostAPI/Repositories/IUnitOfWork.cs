using PostAPI.Features.Categories;
using PostAPI.Features.Comments;
using PostAPI.Features.PostImages;
using PostAPI.Features.Posts;

namespace PostAPI.Repositories;

public interface IUnitOfWork
{
    ICategoryRepository Category { get; }
    IPostRepository Post { get; }
    IPostImageRepository PostImage { get; }
    ICommentRepository Comment { get; }
    Task SaveAsync();
}
