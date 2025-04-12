namespace Post.API.Repositories.IRepositories;

public interface IUnitOfWork
{
    ICategoryRepository Category { get; }
    Task SaveAsync();
}
