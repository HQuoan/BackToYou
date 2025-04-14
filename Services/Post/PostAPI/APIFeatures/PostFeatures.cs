using System.Linq.Expressions;

namespace PostAPI.APIFeatures;

public static class PostFeatures
{
    public static List<Expression<Func<Post, bool>>> Filtering(PostQueryParameters queryParameters)
    {
        var filters = new List<Expression<Func<Post, bool>>>();

        var properties = typeof(PostQueryParameters).GetProperties();

        foreach (var prop in properties)
        {
            var value = prop.GetValue(queryParameters);
            if (value != null)
            {
                switch (prop.Name)
                {
                    case nameof(PostQueryParameters.Slug):
                        filters.Add(m => m.Slug.ToLower().Contains(((string)value).ToLower()));
                        break;
                }
            }
        }

        return filters;
    }


    public static Func<IQueryable<Post>, IOrderedQueryable<Post>>? Sorting(PostQueryParameters queryParameters)
    {
        Func<IQueryable<Post>, IOrderedQueryable<Post>>? orderByFunc = null;

        if (!string.IsNullOrEmpty(queryParameters.OrderBy))
        {
            var isDescending = queryParameters.OrderBy.StartsWith("-");
            var property = isDescending ? queryParameters.OrderBy.Substring(1) : queryParameters.OrderBy;

            orderByFunc = property.ToLower() switch
            {

                "slug" => isDescending
                  ? (Func<IQueryable<Post>, IOrderedQueryable<Post>>)(q => q.OrderByDescending(m => m.Slug))
                  : q => q.OrderBy(m => m.Slug),

                "Postid" => isDescending
                    ? (Func<IQueryable<Post>, IOrderedQueryable<Post>>)(q => q.OrderByDescending(m => m.PostId))
                    : q => q.OrderBy(m => m.PostId),

                _ => q => q.OrderByDescending(m => m.PostId)
            };
        }

        return orderByFunc;
    }




    public static QueryParameters<Post> Build(PostQueryParameters queryParameters)
    {
        return new QueryParameters<Post>
        {
            Filters = Filtering(queryParameters),
            OrderBy = Sorting(queryParameters),
            IncludeProperties = queryParameters.IncludeProperties,
            PageNumber = queryParameters.PageNumber,
            PageSize = queryParameters.PageSize
        };
    }
}