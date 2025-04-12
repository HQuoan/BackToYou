namespace Auth.API.Services.IServices;

public interface IAuthService
{
    Task<UserDto> Register(RegistrationRequestDto registrationRequestDto);
    Task<LoginResponseDto> Login(LoginRequestDto loginRequestDto);
    Task<bool> ConfirmEmail(string userId, string token);
    Task<bool> ChangePassword(string userId, ChangePasswordDto changePasswordDto);
    Task<bool> ForgotPassword(string email);
    Task<bool> ResetPassword(ResetPasswordDto resetPasswordDto);
    Task<bool> AssignRole(string email, string roleName);
    Task<LoginResponseDto> SignInWithGoogle(string token);
}
