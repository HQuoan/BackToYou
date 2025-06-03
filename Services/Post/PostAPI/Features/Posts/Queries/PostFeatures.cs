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

                    case nameof(PostQueryParameters.CategorySlug):
                        filters.Add(m => m.Category.Slug == (string)value);
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

                    //case nameof(PostQueryParameters.StreetAddress):
                    //    filters.Add(m => m.Location.StreetAddress.ToLower().Contains(((string)value).ToLower()));
                    //    break;

                    case nameof(PostQueryParameters.StreetAddress):
                        filters.Add(m => m.Location.StreetAddress.ToLower() == ((string)value).ToLower());
                        break;

                    case nameof(PostQueryParameters.Ward):
                        filters.Add(m => m.Location.Ward.ToLower() == ((string)value).ToLower());
                        break;

                    case nameof(PostQueryParameters.District):
                        filters.Add(m => m.Location.District.ToLower() == ((string)value).ToLower());
                        break;

                    case nameof(PostQueryParameters.Province):
                        filters.Add(m => m.Location.Province.ToLower() == ((string)value).ToLower());
                        break;

                    case nameof(PostQueryParameters.LostOrFoundDate):
                        var lostOrFoundDate = (TimePeriod)value;
                        var lfFrom = lostOrFoundDate.From.Date;
                        var lfTo = lostOrFoundDate.To.Date.AddDays(1).AddTicks(-1);
                        filters.Add(m => m.LostOrFoundDate >= lfFrom && m.LostOrFoundDate <= lfTo);
                        break;

                    case nameof(PostQueryParameters.CreatedAt):
                        var createAt = (TimePeriod)value;
                        var fromDate = createAt.From.Date;
                        var toDate = createAt.To.Date.AddDays(1).AddTicks(-1);
                        filters.Add(m => m.CreatedAt >= fromDate && m.CreatedAt <= toDate);
                        break;
                }
            }
        }

        return filters;
    }


    public static Func<IQueryable<Post>, IOrderedQueryable<Post>> Sorting(PostQueryParameters queryParameters)
    {
        var isDescending = queryParameters.OrderBy?.StartsWith("-") ?? true;
        var property = isDescending && queryParameters.OrderBy != null
            ? queryParameters.OrderBy.Substring(1)
            : queryParameters.OrderBy;

        return property?.ToLower() switch
        {
            "slug" => isDescending
                ? (q => q.OrderByDescending(m => m.Slug))
                : q => q.OrderBy(m => m.Slug),

            "postid" => isDescending
                ? (q => q.OrderByDescending(m => m.PostId))
                : q => q.OrderBy(m => m.PostId),

            "lostorfounddate" => isDescending
                ? (q => q.OrderByDescending(m => m.LostOrFoundDate))
                : q => q.OrderBy(m => m.LostOrFoundDate),

            "createdat" => isDescending
                ? (q => q.OrderByDescending(m => m.CreatedAt))
                : q => q.OrderBy(m => m.CreatedAt),

            "lastmodified" => isDescending
                ? (q => q.OrderByDescending(m => m.LastModified))
                : q => q.OrderBy(m => m.LastModified),

            _ => q => q.OrderByDescending(m => m.CreatedAt)
        };
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