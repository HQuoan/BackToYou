using PostAPI.Features.Followers.Queries;
using System.Linq.Expressions;

namespace FollowerAPI.Features.Followers.Queries;

public static class FollowerFeatures
{
    public static List<Expression<Func<Follower, bool>>> Filtering(FollowerQueryParameters queryParameters)
    {
        var filters = new List<Expression<Func<Follower, bool>>>();

        var properties = typeof(FollowerQueryParameters).GetProperties();

        foreach (var prop in properties)
        {
            var value = prop.GetValue(queryParameters);
            if (value != null)
            {
                switch (prop.Name)
                {
                    case nameof(FollowerQueryParameters.UserId):
                        filters.Add(m => m.UserId == (Guid)value);
                        break;

                    case nameof(FollowerQueryParameters.PostId):
                        filters.Add(m => m.PostId == (Guid)value);
                        break;
                }
            }
        }

        return filters;
    }


    public static Func<IQueryable<Follower>, IOrderedQueryable<Follower>> Sorting(FollowerQueryParameters queryParameters)
    {
        var isDescending = queryParameters.OrderBy?.StartsWith("-") ?? true;
        var property = isDescending && queryParameters.OrderBy != null
            ? queryParameters.OrderBy.Substring(1)
            : queryParameters.OrderBy;

        return property?.ToLower() switch
        {
            "postid" => isDescending
                ? (q => q.OrderByDescending(m => m.FollowerId))
                : q => q.OrderBy(m => m.FollowerId),

            _ => q => q.OrderByDescending(m => m.CreatedAt)
        };
    }


    public static QueryParameters<Follower> Build(FollowerQueryParameters queryParameters)
    {
        return new QueryParameters<Follower>
        {
            Filters = Filtering(queryParameters),
            OrderBy = Sorting(queryParameters),
            IncludeProperties = queryParameters.IncludeProperties,
            PageNumber = queryParameters.PageNumber,
            PageSize = queryParameters.PageSize
        };
    }
}