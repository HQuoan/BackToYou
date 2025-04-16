using System.Linq.Expressions;

namespace PostAPI.Features.Posts.Queries;

public static class CommentFeatures
{
    public static List<Expression<Func<Post, bool>>> Filtering(CommentQueryParameters queryParameters)
    {
        var filters = new List<Expression<Func<Post, bool>>>();

        var properties = typeof(CommentQueryParameters).GetProperties();

        foreach (var prop in properties)
        {
            var value = prop.GetValue(queryParameters);
            if (value != null)
            {
                switch (prop.Name)
                {
                    case nameof(CommentQueryParameters.UserId):
                        filters.Add(m => m.UserId == (Guid)value);
                        break;

                    case nameof(CommentQueryParameters.CategoryId):
                        filters.Add(m => m.CategoryId == (Guid)value);
                        break;

                    case nameof(CommentQueryParameters.Slug):
                        filters.Add(m => m.Slug.ToLower().Contains(((string)value).ToLower()));
                        break;

                    case nameof(CommentQueryParameters.PostType):
                        filters.Add(m => m.PostType == (PostType)value);
                        break;

                    case nameof(CommentQueryParameters.PostLabel):
                        filters.Add(m => m.PostLabel == (PostLabel)value);
                        break;

                    case nameof(CommentQueryParameters.PostStatus):
                        filters.Add(m => m.PostStatus == (PostStatus)value);
                        break;

                }
            }
        }

        return filters;
    }


    public static Func<IQueryable<Post>, IOrderedQueryable<Post>>? Sorting(CommentQueryParameters queryParameters)
    {
        Func<IQueryable<Post>, IOrderedQueryable<Post>>? orderByFunc = null;

        if (!string.IsNullOrEmpty(queryParameters.OrderBy))
        {
            var isDescending = queryParameters.OrderBy.StartsWith("-");
            var property = isDescending ? queryParameters.OrderBy.Substring(1) : queryParameters.OrderBy;

            orderByFunc = property.ToLower() switch
            {

                "slug" => isDescending
                  ? (q => q.OrderByDescending(m => m.Slug))
                  : q => q.OrderBy(m => m.Slug),

                "postid" => isDescending
                    ? (q => q.OrderByDescending(m => m.PostId))
                    : q => q.OrderBy(m => m.PostId),

                _ => q => q.OrderByDescending(m => m.PostId)
            };
        }

        return orderByFunc;
    }

    public static QueryParameters<Post> Build(CommentQueryParameters queryParameters)
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