using System.Linq.Expressions;

namespace NotificationAPI.APIFeatures;

public class NotificationFeatures
{
    public static List<Expression<Func<Notification, bool>>> Filtering(NotificationQueryParameters queryParameters)
    {
        var filters = new List<Expression<Func<Notification, bool>>>();

        var properties = typeof(NotificationQueryParameters).GetProperties();

        foreach (var prop in properties)
        {
            var value = prop.GetValue(queryParameters);
            if (value != null)
            {
                switch (prop.Name)
                {
                    case nameof(NotificationQueryParameters.IsRead):
                        filters.Add(m => m.IsRead == (bool)value);
                        break;
                }
            }
        }

        return filters;
    }


    public static Func<IQueryable<Notification>, IOrderedQueryable<Notification>> Sorting(NotificationQueryParameters queryParameters)
    {
        var isDescending = queryParameters.OrderBy?.StartsWith("-") ?? true;
        var property = isDescending && queryParameters.OrderBy != null
            ? queryParameters.OrderBy.Substring(1)
            : queryParameters.OrderBy;

        return property?.ToLower() switch
        {
            "userid" => isDescending
                ? (q => q.OrderByDescending(m => m.UserId))
                : q => q.OrderBy(m => m.UserId),


            "createdat" => isDescending
                ? (q => q.OrderByDescending(m => m.CreatedAt))
                : q => q.OrderBy(m => m.CreatedAt),

            _ => q => q.OrderByDescending(m => m.CreatedAt)
        };
    }



    public static QueryParameters<Notification> Build(NotificationQueryParameters queryParameters)
    {
        return new QueryParameters<Notification>
        {
            Filters = Filtering(queryParameters),
            OrderBy = Sorting(queryParameters),
            IncludeProperties = queryParameters.IncludeProperties,
            PageNumber = queryParameters.PageNumber,
            PageSize = queryParameters.PageSize
        };
    }
}
