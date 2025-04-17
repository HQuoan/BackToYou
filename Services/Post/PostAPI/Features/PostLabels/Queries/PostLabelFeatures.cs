using System.Linq.Expressions;

namespace PostAPI.Features.PostLabels.Queries;

public static class PostLabelFeatures
{
    public static List<Expression<Func<PostLabel, bool>>> Filtering(PostLabelQueryParameters queryParameters)
    {
        var filters = new List<Expression<Func<PostLabel, bool>>>();

        var properties = typeof(PostLabelQueryParameters).GetProperties();

        foreach (var prop in properties)
        {
            var value = prop.GetValue(queryParameters);
            if (value != null)
            {
                switch (prop.Name)
                {
                    case nameof(PostLabelQueryParameters.Name):
                        filters.Add(m => m.Name == (string)value);
                        break;

                    case nameof(PostLabelQueryParameters.Price):
                        filters.Add(m => m.Price == (decimal)value);
                        break;
                }
            }
        }

        return filters;
    }


    public static Func<IQueryable<PostLabel>, IOrderedQueryable<PostLabel>>? Sorting(PostLabelQueryParameters queryParameters)
    {
        Func<IQueryable<PostLabel>, IOrderedQueryable<PostLabel>>? orderByFunc = null;

        if (!string.IsNullOrEmpty(queryParameters.OrderBy))
        {
            var isDescending = queryParameters.OrderBy.StartsWith("-");
            var property = isDescending ? queryParameters.OrderBy.Substring(1) : queryParameters.OrderBy;

            orderByFunc = property.ToLower() switch
            {
                "name" => isDescending
                    ? (q => q.OrderByDescending(m => m.Name))
                    : q => q.OrderBy(m => m.Name),

                "price" => isDescending
                   ? (q => q.OrderByDescending(m => m.Price))
                   : q => q.OrderBy(m => m.Price),

                _ => q => q.OrderByDescending(m => m.PostLabelId)
            };
        }

        return orderByFunc;
    }

    public static QueryParameters<PostLabel> Build(PostLabelQueryParameters queryParameters)
    {
        return new QueryParameters<PostLabel>
        {
            Filters = Filtering(queryParameters),
            OrderBy = Sorting(queryParameters),
            IncludeProperties = queryParameters.IncludeProperties,
            PageNumber = queryParameters.PageNumber,
            PageSize = queryParameters.PageSize
        };
    }
}