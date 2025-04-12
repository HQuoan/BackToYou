using BuildingBlocks.Exceptions;

namespace Auth.API.Exceptions;

public class UserNotFoundException : NotFoundException
{
    public UserNotFoundException(string key) : base("User", key)
    {
    }
}
