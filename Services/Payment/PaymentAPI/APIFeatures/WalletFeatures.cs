using System.Linq.Expressions;

namespace PaymentAPI.APIFeatures;

public static class WalletFeatures
{
    public static List<Expression<Func<Wallet, bool>>> Filtering(WalletQueryParameters queryParameters)
    {
        var filters = new List<Expression<Func<Wallet, bool>>>();

        var properties = typeof(WalletQueryParameters).GetProperties();

        foreach (var prop in properties)
        {
            var value = prop.GetValue(queryParameters);
            if (value != null)
            {
                switch (prop.Name)
                {
                    case nameof(WalletQueryParameters.UserId):
                        filters.Add(m => m.UserId == (Guid)value);
                        break;
                    case nameof(WalletQueryParameters.Balance):
                        filters.Add(m => m.Balance == (decimal)value);
                        break;
                }
            }
        }

        return filters;
    }


    public static Func<IQueryable<Wallet>, IOrderedQueryable<Wallet>>? Sorting(WalletQueryParameters queryParameters)
    {
        Func<IQueryable<Wallet>, IOrderedQueryable<Wallet>>? orderByFunc = null;

        if (!string.IsNullOrEmpty(queryParameters.OrderBy))
        {
            var isDescending = queryParameters.OrderBy.StartsWith("-");
            var property = isDescending ? queryParameters.OrderBy.Substring(1) : queryParameters.OrderBy;

            orderByFunc = property.ToLower() switch
            {
                "userid" => isDescending
                    ? (Func<IQueryable<Wallet>, IOrderedQueryable<Wallet>>)(q => q.OrderByDescending(m => m.UserId))
                    : q => q.OrderBy(m => m.UserId),

                "balance" => isDescending
                    ? (Func<IQueryable<Wallet>, IOrderedQueryable<Wallet>>)(q => q.OrderByDescending(m => m.Balance))
                    : q => q.OrderBy(m => m.Balance),

                "createdat" => isDescending
                    ? (Func<IQueryable<Wallet>, IOrderedQueryable<Wallet>>)(q => q.OrderByDescending(m => m.CreatedAt))
                    : q => q.OrderBy(m => m.CreatedAt),

                _ => q => q.OrderByDescending(m => m.WalletId)
            };

        }

        return orderByFunc;
    }


    public static QueryParameters<Wallet> Build(WalletQueryParameters queryParameters)
    {
        return new QueryParameters<Wallet>
        {
            Filters = Filtering(queryParameters),
            OrderBy = Sorting(queryParameters),
            IncludeProperties = queryParameters.IncludeProperties,
            PageNumber = queryParameters.PageNumber,
            PageSize = queryParameters.PageSize
        };
    }
}
