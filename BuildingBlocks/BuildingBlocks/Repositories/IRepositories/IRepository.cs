using BuildingBlocks.Dtos;
using System.Linq.Expressions;

namespace BuildingBlocks.Repositories.IRepositories;
public interface IRepository<T> where T : class
{
    Task<IEnumerable<T>> GetAllAsync(QueryParameters<T>? queryParameters = null);

    Task<IEnumerable<TResult>> GetAllAsync<TResult>(
        QueryParameters<T>? queryParameters,
        Expression<Func<T, TResult>> selector);


    Task<int> CountAsync(QueryParameters<T>? queryParameters);
    Task<T> GetAsync(Expression<Func<T, bool>>? filter = null, string? includeProperties = null, bool tracked = false);
    //Task<List<T>> GetsAsync(Expression<Func<T, bool>>? filter = null, string? includeProperties = null);
    Task AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task RemoveAsync(T entity);
    Task RemoveRangeAsync(IEnumerable<T> entities);
}
