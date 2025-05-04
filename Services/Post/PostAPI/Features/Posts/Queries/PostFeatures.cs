using CloudinaryDotNet.Core;
using System.Linq.Expressions;

namespace PostAPI.Features.Posts.Queries;

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
                    case nameof(PostQueryParameters.UserId):
                        filters.Add(m => m.UserId == (Guid)value);
                        break;

                    case nameof(PostQueryParameters.CategoryId):
                        filters.Add(m => m.CategoryId == (Guid)value);
                        break;

                    case nameof(PostQueryParameters.Slug):
                        filters.Add(m => m.Slug.ToLower().Contains(((string)value).ToLower()));
                        break;

                    case nameof(PostQueryParameters.PostType):
                        filters.Add(m => m.PostType == (PostType)value);
                        break;

                    case nameof(PostQueryParameters.PostLabel):
                        filters.Add(m => m.PostLabel == (PostLabel)value);
                        break;

                    case nameof(PostQueryParameters.PostStatus):
                        filters.Add(m => m.PostStatus == (PostStatus)value);
                        break;

                    case nameof(PostQueryParameters.Keyword):
                        var keyword = ((string)value).ToLower();
                        filters.Add(m => m.Title.ToLower().Contains(keyword) || m.Description.ToLower().Contains(keyword));
                        break;

                    case nameof(PostQueryParameters.Phone):
                        filters.Add(m => m.PostContact.Phone != null && m.PostContact.Phone.Contains((string)value));
                        break;

                    case nameof(PostQueryParameters.Email):
                        filters.Add(m => m.PostContact.Email != null && m.PostContact.Email.ToLower().Contains(((string)value).ToLower()));
                        break;

                    case nameof(PostQueryParameters.StreetAddress):
                        filters.Add(m => m.Location.StreetAddress.ToLower().Contains(((string)value).ToLower()));
                        break;

                    case nameof(PostQueryParameters.Ward):
                        filters.Add(m => m.Location.Ward.ToLower().Contains(((string)value).ToLower()));
                        break;

                    case nameof(PostQueryParameters.District):
                        filters.Add(m => m.Location.District.ToLower().Contains(((string)value).ToLower()));
                        break;

                    case nameof(PostQueryParameters.Province):
                        filters.Add(m => m.Location.Province.ToLower().Contains(((string)value).ToLower()));
                        break;

                    case nameof(PostQueryParameters.LostOrFoundDate):
                        var lostOrFoundDate = (TimePeriod)value;
                        filters.Add(m => m.LostOrFoundDate >= lostOrFoundDate.From && m.LostOrFoundDate <= lostOrFoundDate.To);
                        break;

                    case nameof(PostQueryParameters.CreatedAt):
                        var createAt = (TimePeriod)value;
                        filters.Add(m => m.CreatedAt >= createAt.From && m.CreatedAt <= createAt.To);
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
                  ? (q => q.OrderByDescending(m => m.Slug))
                  : q => q.OrderBy(m => m.Slug),

                "postid" => isDescending
                    ? (q => q.OrderByDescending(m => m.PostId))
                    : q => q.OrderBy(m => m.PostId),

                "lostorfounddate" => isDescending
                   ? (q => q.OrderByDescending(m => m.LostOrFoundDate))
                   : (q => q.OrderBy(m => m.LostOrFoundDate)),

                "createdat" => isDescending
                   ? (q => q.OrderByDescending(m => m.CreatedAt))
                   : (q => q.OrderBy(m => m.CreatedAt)),

                _ => q => q.OrderByDescending(m => m.CreatedAt)
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