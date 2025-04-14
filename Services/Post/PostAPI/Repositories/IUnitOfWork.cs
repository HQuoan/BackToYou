using PostAPI.Features.Categories;
using PostAPI.Features.Posts;

namespace PostAPI.Repositories;

public interface IUnitOfWork
{
    ICategoryRepository Category { get; }
    IPostRepository Post { get; }
    Task SaveAsync();
}
