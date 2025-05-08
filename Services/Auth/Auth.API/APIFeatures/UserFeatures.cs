using BuildingBlocks.Dtos;
using System.Linq.Expressions;

namespace Auth.API.APIFeatures;


public static class UserFeatures
{
    public static List<Expression<Func<ApplicationUser, bool>>> Filtering(UserQueryParameters queryParameters)
    {
        var filters = new List<Expression<Func<ApplicationUser, bool>>>();

        var properties = typeof(UserQueryParameters).GetProperties();

        foreach (var prop in properties)
        {
            var value = prop.GetValue(queryParameters);
            if (value != null)
            {
                switch (prop.Name)
                {
                    case nameof(UserQueryParameters.Email):
                        filters.Add(m => m.Email.ToLower().Contains(((string)value).ToLower()));
                        break;

                    case nameof(UserQueryParameters.FullName):
                        filters.Add(m => m.FullName.ToLower().Contains(((string)value).ToLower()));
                        break;

                    case nameof(UserQueryParameters.Sex):
                        filters.Add(m => m.Sex.ToLower().Contains(((string)value).ToLower()));
                        break;

                    case nameof(UserQueryParameters.DateOfBirth):
                        filters.Add(m => m.DateOfBirth == (DateTime)value);
                        break;

                }
            }
        }

        return filters;
    }


    public static Func<IQueryable<ApplicationUser>, IOrderedQueryable<ApplicationUser>> Sorting(UserQueryParameters queryParameters)
    {
        var isDescending = queryParameters.OrderBy?.StartsWith("-") ?? true;
        var property = isDescending && queryParameters.OrderBy != null
            ? queryParameters.OrderBy.Substring(1)
            : queryParameters.OrderBy;

        return property?.ToLower() switch
        {
            "fullname" => isDescending
                ? (q => q.OrderByDescending(m => m.FullName))
                : q => q.OrderBy(m => m.FullName),

            "email" => isDescending
                ? (q => q.OrderByDescending(m => m.Email))
                : q => q.OrderBy(m => m.Email),

            _ => q => q.OrderByDescending(m => m.CreatedAt) // mặc định
        };
    }


    public static QueryParameters<ApplicationUser> Build(UserQueryParameters queryParameters)
    {
        return new QueryParameters<ApplicationUser>
        {
            Filters = Filtering(queryParameters),
            OrderBy = Sorting(queryParameters),
            IncludeProperties = queryParameters.IncludeProperties,
            PageNumber = queryParameters.PageNumber,
            PageSize = queryParameters.PageSize
        };
    }
}


