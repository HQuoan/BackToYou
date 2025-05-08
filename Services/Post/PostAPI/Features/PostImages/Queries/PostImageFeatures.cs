using System.Linq.Expressions;

namespace PostAPI.Features.PostImages.Queries;

public static class PostImageFeatures
{
    public static List<Expression<Func<PostImage, bool>>> Filtering(PostImageQueryParameters queryParameters)
    {
        var filters = new List<Expression<Func<PostImage, bool>>>();

        var properties = typeof(PostImageQueryParameters).GetProperties();

        foreach (var prop in properties)
        {
            var value = prop.GetValue(queryParameters);
            if (value != null)
            {
                switch (prop.Name)
                {
                    case nameof(PostImageQueryParameters.PostId):
                        filters.Add(m => m.PostId == (Guid)value);
                        break;

                    case nameof(PostImageQueryParameters.ImageUrl):
                        filters.Add(m => m.ImageUrl == (string)value);
                        break;
                }
            }
        }

        return filters;
    }


    public static Func<IQueryable<PostImage>, IOrderedQueryable<PostImage>> Sorting(PostImageQueryParameters queryParameters)
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

            _ => q => q.OrderByDescending(m => m.PostImageId)
        };
    }


    public static QueryParameters<PostImage> Build(PostImageQueryParameters queryParameters)
    {
        return new QueryParameters<PostImage>
        {
            Filters = Filtering(queryParameters),
            OrderBy = Sorting(queryParameters),
            IncludeProperties = queryParameters.IncludeProperties,
            PageNumber = queryParameters.PageNumber,
            PageSize = queryParameters.PageSize
        };
    }
}