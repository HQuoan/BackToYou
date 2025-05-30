using BuildingBlocks.Dtos;
using BuildingBlocks.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BuildingBlocks.Repositories;
public class Repository<T> : IRepository<T> where T : class
{
    private readonly DbContext _db;
    internal DbSet<T> dbSet;

    public Repository(DbContext db)
    {
        _db = db;
        dbSet = _db.Set<T>();
    }

    public async Task AddAsync(T entity)
    {
        await dbSet.AddAsync(entity);
    }

    public async Task AddRangeAsync(IEnumerable<T> entities)
    {
        await dbSet.AddRangeAsync(entities);
    }

    public async Task<T> GetAsync(Expression<Func<T, bool>>? filter = null, string? includeProperties = null, bool tracked = false)
    {
        IQueryable<T> query = tracked ? dbSet : dbSet.AsNoTracking();

        if (filter != null)
        {
            query = query.Where(filter);
        }

        if (!string.IsNullOrEmpty(includeProperties))
        {
            foreach (var includeProp in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProp);
            }
        }

        return await query.FirstOrDefaultAsync();
    }


    private IQueryable<T> BuildQuery(QueryParameters<T>? queryParameters)
    {
        IQueryable<T> query = dbSet;

        if (queryParameters == null)
            queryParameters = new QueryParameters<T>();

        // Filtering
        if (queryParameters.Filters != null && queryParameters.Filters.Any())
        {
            foreach (var filter in queryParameters.Filters)
            {
                query = query.Where(filter);
            }
        }

        // Including
        if (!string.IsNullOrEmpty(queryParameters.IncludeProperties))
        {
            foreach (var includeProp in queryParameters.IncludeProperties
                         .Split(',', StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProp.Trim());
            }
        }

        // Sorting
        if (queryParameters.OrderBy != null)
        {
            query = queryParameters.OrderBy(query);
        }

        // Pagination
        if (queryParameters.PageSize > 0)
        {
            int skip = (queryParameters.PageNumber - 1) * queryParameters.PageSize;
            query = query.Skip(skip).Take(queryParameters.PageSize);
        }

        return query;
    }

    public async Task<IEnumerable<T>> GetAllAsync(QueryParameters<T>? queryParameters)
    {
        var query = BuildQuery(queryParameters);
        return await query.ToListAsync();
    }

    public async Task<IEnumerable<TResult>> GetAllAsync<TResult>(
    QueryParameters<T>? queryParameters,
    Expression<Func<T, TResult>> selector)
    {
        var query = BuildQuery(queryParameters);
        return await query.Select(selector).ToListAsync();
    }

    public async Task<int> CountAsync(QueryParameters<T>? queryParameters)
    {
        IQueryable<T> query = dbSet;

        if (queryParameters != null && queryParameters.Filters != null && queryParameters.Filters.Any())
        {
            foreach (var filter in queryParameters.Filters)
            {
                query = query.Where(filter);
            }
        }

        return await query.CountAsync();
    }

    public async Task RemoveAsync(T entity)
    {
        dbSet.Remove(entity);
        await Task.CompletedTask;
    }

    public async Task RemoveRangeAsync(IEnumerable<T> entities)
    {
        dbSet.RemoveRange(entities);
        await Task.CompletedTask;
    }

    public async Task UpdateAsync(T entity)
    {
        dbSet.Update(entity);
        await Task.CompletedTask;
    }
}
