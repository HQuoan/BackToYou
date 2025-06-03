using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PostAPI.Features.PostImages.Dtos;
using System.Text;

namespace PostAPI.Services;

public class AIService : IAIService
{
    private readonly IHttpClientFactory _httpClientFactory;

    public AIService(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }


    public async Task<string> Embedding(List<PostImageInput> data)
    {
        try
        {
            var client = _httpClientFactory.CreateClient(SD.HttpClient_AI);

            var content = new StringContent(
                JsonConvert.SerializeObject(data),
                Encoding.UTF8,
                "application/json");

            var response = await client.PostAsync("/embedding", content);
            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new BadRequestException(responseString);


            return responseString;
        }
        catch (HttpRequestException ex)
        {
            throw new BadRequestException("AI service is unavailable.");
        }
        catch (Exception ex)
        {
            throw new BadRequestException(ex.Message);
        }
    }

    public async Task<string> DeleteEmbedding(Guid postId)
    {
        try
        {
            var client = _httpClientFactory.CreateClient(SD.HttpClient_AI);

            var response = await client.DeleteAsync($"/{postId}");
            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new BadRequestException(responseString);


            return responseString;
        }
        catch (HttpRequestException ex)
        {
            throw new BadRequestException("AI service is unavailable.");
        }
        catch (Exception ex)
        {
            throw new BadRequestException(ex.Message);
        }
    }


    public async Task<SearchResponseDto> Compare([FromForm] AiSearchForm form)
    {
        try
        {
            var client = _httpClientFactory.CreateClient(SD.HttpClient_AI);
            client.Timeout = TimeSpan.FromSeconds(300);

            using var content = new MultipartFormDataContent();

            if (form.File != null)
            {
                if (form.File.Length > 10_000_000) // Giới hạn 10MB
                {
                    throw new BadRequestException("File size exceeds limit (10MB).");
                }

                var stream = form.File.OpenReadStream();
                var fileContent = new StreamContent(stream);
                fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(form.File.ContentType ?? "application/octet-stream");
                content.Add(fileContent, "file", form.File.FileName);
            }
            else if (!string.IsNullOrEmpty(form.TextQuery))
            {
                content.Add(new StringContent(form.TextQuery), "text_query");
            }
            else
            {
                throw new BadRequestException("Missing file or text query");
            }
            content.Add(new StringContent(form.Top.ToString()), "top_k");


            var response = await client.PostAsync("/compare", content);
            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new BadRequestException($"Call to AI service failed: {responseString}");

            var resultObj = JsonConvert.DeserializeObject<SearchResponseDto>(responseString);


            return resultObj;
        }
        catch (HttpRequestException ex)
        {
            throw new BadRequestException("AI service is unavailable.");
        }
        catch (Exception ex)
        {
            throw new BadRequestException(ex.Message);
        }
    }
}
