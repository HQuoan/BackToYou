using System.Linq.Expressions;

namespace PostAPI.Features.Reports.Queries;

public static class ReportFeatures
{
    public static List<Expression<Func<Report, bool>>> Filtering(ReportQueryParameters queryParameters)
    {
        var filters = new List<Expression<Func<Report, bool>>>();

        var properties = typeof(ReportQueryParameters).GetProperties();

        foreach (var prop in properties)
        {
            var value = prop.GetValue(queryParameters);
            if (value != null)
            {
                switch (prop.Name)
                {
                    case nameof(ReportQueryParameters.UserId):
                        filters.Add(m => m.UserId == (Guid)value);
                        break;

                    case nameof(ReportQueryParameters.PostId):
                        filters.Add(m => m.PostId == (Guid)value);
                        break;

                    case nameof(ReportQueryParameters.Title):
                        filters.Add(m => m.Title == (ReportTitle)value);
                        break;

                    case nameof(ReportQueryParameters.Status):
                        filters.Add(m => m.Status == (PostStatus)value);
                        break;

                }
            }
        }

        return filters;
    }


    public static Func<IQueryable<Report>, IOrderedQueryable<Report>> Sorting(ReportQueryParameters queryParameters)
    {
        var isDescending = queryParameters.OrderBy?.StartsWith("-") ?? true;
        var property = isDescending && queryParameters.OrderBy != null
            ? queryParameters.OrderBy.Substring(1)
            : queryParameters.OrderBy;

        return property?.ToLower() switch
        {
            "createdat" => isDescending
                ? (q => q.OrderByDescending(m => m.CreatedAt))
                : q => q.OrderBy(m => m.CreatedAt),

            _ => q => q.OrderByDescending(m => m.CreatedAt)
        };
    }


    public static QueryParameters<Report> Build(ReportQueryParameters queryParameters)
    {
        return new QueryParameters<Report>
        {
            Filters = Filtering(queryParameters),
            OrderBy = Sorting(queryParameters),
            IncludeProperties = queryParameters.IncludeProperties,
            PageNumber = queryParameters.PageNumber,
            PageSize = queryParameters.PageSize
        };
    }
}
