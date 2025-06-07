using Newtonsoft.Json;
using System.Text;

namespace PaymentAPI.Services;

public class UserService : IUserService
{
    private readonly IHttpClientFactory _httpClientFactory;

    public UserService(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<List<UserDto>> GetUsersByIds(IEnumerable<string> ids)
    {
        if (ids == null || !ids.Any()) return new List<UserDto>();

        try
        {
            var client = _httpClientFactory.CreateClient(SD.HttpClient_User);

            var content = new StringContent(
                JsonConvert.SerializeObject(ids),
                Encoding.UTF8,
                "application/json");

            var response = await client.PostAsync("/users/get-by-ids", content);

            if (!response.IsSuccessStatusCode)
                return new List<UserDto>();

            var apiContent = await response.Content.ReadAsStringAsync();
            var resp = JsonConvert.DeserializeObject<ResponseDto>(apiContent);

            if (resp == null || !resp.IsSuccess)
                return new List<UserDto>();

            var users = JsonConvert.DeserializeObject<List<UserDto>>(resp.Result.ToString());
            return users ?? new List<UserDto>();
        }
        catch
        {
            return new List<UserDto>();
        }
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

    public async Task<List<UserDto>> SearchUsersByEmail(string keyword)
    {
        if (string.IsNullOrWhiteSpace(keyword)) return new();

        try
        {
            var client = _httpClientFactory.CreateClient(SD.HttpClient_User);
            var encoded = Uri.EscapeDataString(keyword);

            var response = await client.GetAsync($"/users/search-by-email/{encoded}");

            if (!response.IsSuccessStatusCode)
                return new();

            var apiContent = await response.Content.ReadAsStringAsync();
            var resp = JsonConvert.DeserializeObject<ResponseDto>(apiContent);

            if (resp == null || !resp.IsSuccess)
                return new();

            return JsonConvert.DeserializeObject<List<UserDto>>(resp.Result.ToString()) ?? new();
        }
        catch
        {
            return new();
        }
    }
}