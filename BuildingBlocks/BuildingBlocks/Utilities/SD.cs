using Microsoft.AspNetCore.Http;

namespace BuildingBlocks.Utilities;
public static class SD
{
    public const string AdminEmail = "admin@gmail.com";

    public const string AdminRole = "ADMIN";
    public const string CustomerRole = "CUSTOMER";

    public const string Male = "Male";
    public const string Female = "Female";
    public const string Other = "Other";


    public const string PaymentWithStripe = "STRIPE";
    public const string PaymentWithPayOS = "PAYOS";

    public const string Status_Pending = "Pending";
    public const string Status_Session_Created = "Session_Created";
    public const string Status_Approved = "Approved";

    public const string PostLabel_Priority_Price = "10000";

    public const string HttpClient_Payment = "Payment";

    public const string AccessTokenCookieName = "access_token";
    

}

public static class CookieHelper
{
    public static void SetAuthCookie(HttpResponse response, string token)
    {
        response.Cookies.Append(
            SD.AccessTokenCookieName,
            token,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddDays(7),
                Path = "/"
            }
        );
    }

    public static void RemoveAuthCookie(HttpResponse response)
    {
        response.Cookies.Delete(
            SD.AccessTokenCookieName,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Path = "/"
            }
        );
    }
}

