using Microsoft.Extensions.Options;
using System.Text.Json;
using System.Transactions;

namespace PostAPI.Services;

public class TranslateService : ITranslateService
{
    private readonly HttpClient _httpClient;
    private readonly string _url;

    public TranslateService(IHttpClientFactory httpClientFactory, IOptions<LibreTranslateOptions> options)
    {
        _httpClient = httpClientFactory.CreateClient(nameof(TranslateService));
        _url = "https://libretranslate.de/translate";
    }

    public async Task<string> TranslateToEnglishAsync(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return string.Empty;

        var parameters = new Dictionary<string, string>
        {
            { "q", text },
            { "source", "auto" }, // Auto-detect source language
            { "target", "en" },   // Target: English
            { "format", "text" }
        };

        try
        {
            var content = new FormUrlEncodedContent(parameters);
            var response = await _httpClient.PostAsync(_url, content);
            response.EnsureSuccessStatusCode();

            var resultJson = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<string>(resultJson);
            return result ?? string.Empty;
        }
        catch (Exception e)
        {
            return string.Empty;    
        }
    }
}
