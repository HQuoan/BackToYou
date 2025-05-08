using System.Linq.Expressions;

namespace PostAPI.Features.Categories.Queries;

public static class CategoryFeatures
{
    public static List<Expression<Func<Category, bool>>> Filtering(CategoryQueryParameters queryParameters)
    {
        var filters = new List<Expression<Func<Category, bool>>>();

        var properties = typeof(CategoryQueryParameters).GetProperties();

        foreach (var prop in properties)
        {
            var value = prop.GetValue(queryParameters);
            if (value != null)
            {
                switch (prop.Name)
                {
                    case nameof(CategoryQueryParameters.Name):
                        filters.Add(m => m.Name.ToLower().Contains(((string)value).ToLower()));
                        break;
                    case nameof(CategoryQueryParameters.Slug):
                        filters.Add(m => m.Slug.ToLower().Contains(((string)value).ToLower()));
                        break;
                }
            }
        }

        return filters;
    }


    public static Func<IQueryable<Category>, IOrderedQueryable<Category>> Sorting(CategoryQueryParameters queryParameters)
    {
        var isDescending = queryParameters.OrderBy?.StartsWith("-") ?? true;
        var property = isDescending && queryParameters.OrderBy != null
            ? queryParameters.OrderBy.Substring(1)
            : queryParameters.OrderBy;

        return property?.ToLower() switch
        {
            "name" => isDescending
                ? (q => q.OrderByDescending(m => m.Name))
                : q => q.OrderBy(m => m.Name),

            "slug" => isDescending
                ? (q => q.OrderByDescending(m => m.Slug))
                : q => q.OrderBy(m => m.Slug),

            "categoryid" => isDescending
                ? (q => q.OrderByDescending(m => m.CategoryId))
                : q => q.OrderBy(m => m.CategoryId),

            _ => q => q.OrderByDescending(m => m.CreatedAt) // mặc định
        };
    }


    public static QueryParameters<Category> Build(CategoryQueryParameters queryParameters)
    {
        return new QueryParameters<Category>
        {
            Filters = Filtering(queryParameters),
            OrderBy = Sorting(queryParameters),
            IncludeProperties = queryParameters.IncludeProperties,
            PageNumber = queryParameters.PageNumber,
            PageSize = queryParameters.PageSize
        };
    }
}