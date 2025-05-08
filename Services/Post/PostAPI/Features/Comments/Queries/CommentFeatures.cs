using PostAPI.Features.Comments.Queries;
using System.Linq.Expressions;

namespace CommentAPI.Features.Comments.Queries;

public static class CommentFeatures
{
    public static List<Expression<Func<Comment, bool>>> Filtering(CommentQueryParameters queryParameters)
    {
        var filters = new List<Expression<Func<Comment, bool>>>();

        var properties = typeof(CommentQueryParameters).GetProperties();

        foreach (var prop in properties)
        {
            var value = prop.GetValue(queryParameters);
            if (value != null)
            {
                switch (prop.Name)
                {
                    case nameof(CommentQueryParameters.CommentParentId):
                        filters.Add(m => m.CommentParentId == (Guid)value);
                        break;

                    case nameof(CommentQueryParameters.UserId):
                        filters.Add(m => m.UserId == (Guid)value);
                        break;

                    case nameof(CommentQueryParameters.PostId):
                        filters.Add(m => m.PostId == (Guid)value);
                        break;

                    case nameof(CommentQueryParameters.Description):
                        filters.Add(m => m.Description.ToLower().Contains(((string)value).ToLower()));
                        break;

                }
            }
        }

        return filters;
    }


    //public static Func<IQueryable<Comment>, IOrderedQueryable<Comment>>? Sorting(CommentQueryParameters queryParameters)
    //{
    //    Func<IQueryable<Comment>, IOrderedQueryable<Comment>>? orderByFunc = null;

    //    if (!string.IsNullOrEmpty(queryParameters.OrderBy))
    //    {
    //        var isDescending = queryParameters.OrderBy.StartsWith("-");
    //        var property = isDescending ? queryParameters.OrderBy.Substring(1) : queryParameters.OrderBy;

    //        orderByFunc = property.ToLower() switch
    //        {
    //            "postid" => isDescending
    //                ? (q => q.OrderByDescending(m => m.CommentId))
    //                : q => q.OrderBy(m => m.CommentId),

    //            _ => q => q.OrderByDescending(m => m.CreatedAt)
    //        };
    //    }

    //    return orderByFunc;
    //}

    public static Func<IQueryable<Comment>, IOrderedQueryable<Comment>> Sorting(CommentQueryParameters queryParameters)
    {
        var isDescending = queryParameters.OrderBy?.StartsWith("-") ?? true;
        var property = isDescending && queryParameters.OrderBy != null
            ? queryParameters.OrderBy.Substring(1)
            : queryParameters.OrderBy;

        return property?.ToLower() switch
        {
            "postid" => isDescending
                ? (q => q.OrderByDescending(m => m.PostId))
                : q => q.OrderBy(m => m.PostId),

            _ => q => q.OrderByDescending(m => m.CreatedAt)
        };
    }


    public static QueryParameters<Comment> Build(CommentQueryParameters queryParameters)
    {
        return new QueryParameters<Comment>
        {
            Filters = Filtering(queryParameters),
            OrderBy = Sorting(queryParameters),
            IncludeProperties = queryParameters.IncludeProperties,
            PageNumber = queryParameters.PageNumber,
            PageSize = queryParameters.PageSize
        };
    }
}