using PostAPI.Features.Posts.Dtos;

namespace PostAPI.Services.IServices;

public interface IUserService
{
    Task<List<UserDto>> GetUsersByIds(IEnumerable<string> ids);
}
