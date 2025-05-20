using Newtonsoft.Json;

namespace PaymentAPI.Services;

public class UserService : IUserService
{
    private readonly IHttpClientFactory _httpClientFactory;

    public UserService(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<UserDto> GetUserByEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email)) return null;

        try
        {
            var client = _httpClientFactory.CreateClient(SD.HttpClient_User);

            var encodedEmail = System.Web.HttpUtility.UrlEncode(email);
            var response = await client.GetAsync($"/users/get-by-email/{encodedEmail}");

            if (!response.IsSuccessStatusCode)
                return null;

            var apiContent = await response.Content.ReadAsStringAsync();
            var resp = JsonConvert.DeserializeObject<ResponseDto>(apiContent);

            if (resp == null || !resp.IsSuccess)
                return null;

            return JsonConvert.DeserializeObject<UserDto>(resp.Result.ToString());
        }
        catch
        {
            return null;
        }
    }
}