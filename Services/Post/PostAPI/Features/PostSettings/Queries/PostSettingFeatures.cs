using System.Linq.Expressions;

namespace PostAPI.Features.PostSettings.Queries;

public static class PostSettingFeatures
{
    public static List<Expression<Func<PostSetting, bool>>> Filtering(PostSettingQueryParameters queryParameters)
    {
        var filters = new List<Expression<Func<PostSetting, bool>>>();

        var properties = typeof(PostSettingQueryParameters).GetProperties();

        foreach (var prop in properties)
        {
            var value = prop.GetValue(queryParameters);
            if (value != null)
            {
                switch (prop.Name)
                {
                    case nameof(PostSettingQueryParameters.Name):
                        filters.Add(m => m.Name.ToLower().Contains(((string)value).ToLower()));
                        break;

                    case nameof(PostSettingQueryParameters.Value):
                        filters.Add(m => m.Value.ToLower().Contains(((string)value).ToLower()));
                        break;
                }
            }
        }

        return filters;
    }


    public static Func<IQueryable<PostSetting>, IOrderedQueryable<PostSetting>>? Sorting(PostSettingQueryParameters queryParameters)
    {
        Func<IQueryable<PostSetting>, IOrderedQueryable<PostSetting>>? orderByFunc = null;

        if (!string.IsNullOrEmpty(queryParameters.OrderBy))
        {
            var isDescending = queryParameters.OrderBy.StartsWith("-");
            var property = isDescending ? queryParameters.OrderBy.Substring(1) : queryParameters.OrderBy;

            orderByFunc = property.ToLower() switch
            {
                "name" => isDescending
                    ? (q => q.OrderByDescending(m => m.Name))
                    : q => q.OrderBy(m => m.Name),

                "value" => isDescending
                   ? (q => q.OrderByDescending(m => m.Value))
                   : q => q.OrderBy(m => m.Value),

                _ => q => q.OrderByDescending(m => m.PostSettingId)
            };
        }

        return orderByFunc;
    }

    public static QueryParameters<PostSetting> Build(PostSettingQueryParameters queryParameters)
    {
        return new QueryParameters<PostSetting>
        {
            Filters = Filtering(queryParameters),
            OrderBy = Sorting(queryParameters),
            IncludeProperties = queryParameters.IncludeProperties,
            PageNumber = queryParameters.PageNumber,
            PageSize = queryParameters.PageSize
        };
    }
}