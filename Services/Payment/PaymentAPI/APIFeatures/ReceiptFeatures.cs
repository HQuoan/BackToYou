using System.Linq.Expressions;

namespace PaymentAPI.APIFeatures;

public static class ReceiptFeatures
{
    public static List<Expression<Func<Receipt, bool>>> Filtering(ReceiptQueryParameters queryParameters)
    {
        var filters = new List<Expression<Func<Receipt, bool>>>();

        var properties = typeof(ReceiptQueryParameters).GetProperties();

        foreach (var prop in properties)
        {
            var value = prop.GetValue(queryParameters);
            if (value != null)
            {
                switch (prop.Name)
                {
                    case nameof(ReceiptQueryParameters.UserId):
                        filters.Add(m => m.UserId == (Guid)value);
                        break;
                    case nameof(ReceiptQueryParameters.Email):
                        filters.Add(m => m.Email != null && m.Email.ToLower().Contains(((string)value).ToLower()));
                        break;
                    case nameof(ReceiptQueryParameters.Amount):
                        filters.Add(m => m.Amount == (decimal)value);
                        break;
                    case nameof(ReceiptQueryParameters.CreateAt):
                        filters.Add(m => m.CreatedAt == (DateTime)value);
                        break;
                    case nameof(ReceiptQueryParameters.Status):
                        filters.Add(m => m.Status != null && m.Status.ToLower() == ((string)value).ToLower());
                        break;
                }
            }
        }

        return filters;
    }


    public static Func<IQueryable<Receipt>, IOrderedQueryable<Receipt>> Sorting(ReceiptQueryParameters queryParameters)
    {
        var isDescending = queryParameters.OrderBy?.StartsWith("-") ?? true;
        var property = isDescending && queryParameters.OrderBy != null
            ? queryParameters.OrderBy.Substring(1)
            : queryParameters.OrderBy;

        return property?.ToLower() switch
        {
            "receiptid" => isDescending
                ? (q => q.OrderByDescending(m => m.ReceiptId))
                : q => q.OrderBy(m => m.ReceiptId),

            "userid" => isDescending
                ? (q => q.OrderByDescending(m => m.UserId))
                : q => q.OrderBy(m => m.UserId),

            "email" => isDescending
                ? (q => q.OrderByDescending(m => m.Email))
                : q => q.OrderBy(m => m.Email),

            "amount" => isDescending
                ? (q => q.OrderByDescending(m => m.Amount))
                : q => q.OrderBy(m => m.Amount),

            "createdat" => isDescending
                ? (q => q.OrderByDescending(m => m.CreatedAt))
                : q => q.OrderBy(m => m.CreatedAt),

            "status" => isDescending
                ? (q => q.OrderByDescending(m => m.Status))
                : q => q.OrderBy(m => m.Status),

            _ => q => q.OrderByDescending(m => m.CreatedAt) // mặc định
        };
    }



    public static QueryParameters<Receipt> Build(ReceiptQueryParameters queryParameters)
    {
        return new QueryParameters<Receipt>
        {
            Filters = Filtering(queryParameters),
            OrderBy = Sorting(queryParameters),
            IncludeProperties = queryParameters.IncludeProperties,
            PageNumber = queryParameters.PageNumber,
            PageSize = queryParameters.PageSize
        };
    }
}
