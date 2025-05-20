namespace PaymentAPI.Services.IServices;

public interface IUserService
{
    Task<UserDto> GetUserByEmail(string email);
}