namespace PostAPI.Repositories.IRepositories;

public interface IUnitOfWork
{
    ICategoryRepository Category { get; }
    Task SaveAsync();
}
