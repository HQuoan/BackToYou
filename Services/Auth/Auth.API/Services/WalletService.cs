using Newtonsoft.Json;
using System.Text;

namespace Auth.API.Services;

public class WalletService : IWalletService
{
    private readonly IHttpClientFactory _httpClientFactory;

    public WalletService(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<List<WalletDto>> GetWallets(List<Guid> userIds)
    {
        if (userIds == null || !userIds.Any()) return new List<WalletDto>();

        try
        {
            var client = _httpClientFactory.CreateClient(SD.HttpClient_Payment);

            var content = new StringContent(
                JsonConvert.SerializeObject(userIds),
                Encoding.UTF8,
                "application/json");

            var response = await client.PostAsync("/wallets/get-by-user-ids", content);

            if (!response.IsSuccessStatusCode)
                return new List<WalletDto>();

            var apiContent = await response.Content.ReadAsStringAsync();
            var resp = JsonConvert.DeserializeObject<ResponseDto>(apiContent);

            if (resp == null || !resp.IsSuccess)
                return new List<WalletDto>();

            var users = JsonConvert.DeserializeObject<List<WalletDto>>(resp.Result.ToString());
            return users ?? new List<WalletDto>();
        }
        catch
        {
            return new List<WalletDto>();
        }
    }
}
