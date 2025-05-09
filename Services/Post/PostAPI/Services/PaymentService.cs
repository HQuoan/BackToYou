using Newtonsoft.Json;
using PostAPI.Features.Posts.Dtos;
using System.Text;

namespace PostAPI.Services;

public class PaymentService : IPaymentService
{
    private readonly IHttpClientFactory _httpClientFactory;

    public PaymentService(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<bool> Refund(RefundDto refundDto)
    {
        try
        {
            var client = _httpClientFactory.CreateClient(SD.HttpClient_Payment);

            var content = new StringContent(
                JsonConvert.SerializeObject(refundDto),
                Encoding.UTF8,
                "application/json");

            var response = await client.PutAsync("/wallets/refund", content);

            if (!response.IsSuccessStatusCode)
                throw new BadRequestException("Refund request failed.");

            var apiContent = await response.Content.ReadAsStringAsync();
            var resp = JsonConvert.DeserializeObject<ResponseDto>(apiContent);

            if (resp == null || !resp.IsSuccess)
                throw new BadRequestException("Refund was not successful.");

            return true;
        }
        catch (HttpRequestException ex)
        {
            throw new BadRequestException("Payment service is unavailable.");
        }
        catch (Exception ex)
        {
            throw new BadRequestException("An unexpected error occurred during refund.");
        }
    }


    public async Task<bool> SubtractBalance(decimal amount)
    {
        try
        {
            var client = _httpClientFactory.CreateClient(SD.HttpClient_Payment);
            var content = new StringContent(
                JsonConvert.SerializeObject(amount),
                Encoding.UTF8,
                "application/json");

            var response = await client.PutAsync($"/wallets/subtract-balance", content);

            if (!response.IsSuccessStatusCode)
                throw new BadRequestException("Subtract balance request failed.");

            var apiContent = await response.Content.ReadAsStringAsync();
            var resp = JsonConvert.DeserializeObject<ResponseDto>(apiContent);

            if (resp == null || !resp.IsSuccess)
                throw new BadRequestException("Balance subtraction was not successful.");

            return true;
        }
        catch (HttpRequestException ex)
        {
            throw new BadRequestException("Payment service is unavailable.");
        }
        catch (Exception ex)
        {
            throw new BadRequestException("An unexpected error occurred during balance subtraction.");
        }
    }


}
