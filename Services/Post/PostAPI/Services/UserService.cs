using CloudinaryDotNet;
using Newtonsoft.Json;
using PostAPI.Features.Posts.Dtos;
using System.Text;

namespace PostAPI.Services;

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


    //public async Task<List<UserDto>> GetUsersByIds(IEnumerable<string> ids)
    //{
    //    try
    //    {
    //        if (ids == null || !ids.Any())
    //            throw new BadRequestException("Ids list is empty.");

    //        var client = _httpClientFactory.CreateClient(SD.HttpClient_User);

    //        var content = new StringContent(
    //            JsonConvert.SerializeObject(ids),
    //            Encoding.UTF8,
    //            "application/json");

    //        var response = await client.PostAsync("/users/get-by-ids", content);

    //        if (!response.IsSuccessStatusCode)
    //            throw new BadRequestException("User service request failed.");

    //        var apiContent = await response.Content.ReadAsStringAsync();
    //        var resp = JsonConvert.DeserializeObject<ResponseDto>(apiContent);

    //        if (resp == null || !resp.IsSuccess)
    //            throw new BadRequestException(resp?.Message ?? "Failed to retrieve users.");

    //        var users = JsonConvert.DeserializeObject<List<UserDto>>(resp.Result.ToString());
    //        return users ?? new List<UserDto>();
    //    }
    //    catch (HttpRequestException)
    //    {
    //        throw new BadRequestException("User service is unavailable.");
    //    }
    //    catch (Exception ex)
    //    {
    //        throw new BadRequestException(ex.Message);
    //    }
    //}

}
