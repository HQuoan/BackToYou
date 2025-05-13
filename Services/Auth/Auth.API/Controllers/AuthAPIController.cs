using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace Auth.API.Controllers;
[Route("auth")]
[ApiController]
public class AuthAPIController : ControllerBase
{
    private readonly IAuthService _authService;
    private ResponseDto _response;
    private readonly ApiSettings _apiSettings;
    public AuthAPIController(IAuthService authService, IOptions<ApiSettings> apiSettings)
    {
        _authService = authService;
        _apiSettings = apiSettings.Value;
        _response = new();
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegistrationRequestDto model)
    {
        var userDto = await _authService.Register(model);
        _response.Result = userDto;
        _response.Message = "Register successfully.";

        return CreatedAtAction(nameof(Register), _response);
    }

    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail(string userId, string token)
    {
        var result = await _authService.ConfirmEmail(userId, token);

        //_response.Message = "Email confirmed successfully.";
        //return Ok(_response);
        return Redirect($"{_apiSettings.WebClientUrl}/login");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto model)
    {
        var loginResponse = await _authService.Login(model);
        if (loginResponse.User == null)
        {
            throw new BadRequestException("Username or password is incorrect");
        }
        // Thiết lập cookie
        CookieHelper.SetAuthCookie(Response, loginResponse.Token);

        _response.Result = loginResponse;
        _response.Message = "Login successfully.";
        return Ok(_response);
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        CookieHelper.RemoveAuthCookie(Response);

        _response.Message = "Logged out successfully.";

        return Ok(_response);
    }


    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var result = await _authService.ChangePassword(userId, changePasswordDto);
        if (!result)
        {
            throw new BadRequestException("Password change failed.");
        }

        CookieHelper.RemoveAuthCookie(Response);

        _response.Message = "Password changed successfully. Please login again.";
        return Ok(_response);
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
    {
        var result = await _authService.ForgotPassword(forgotPasswordDto.Email);
        if (!result)
        {
            throw new BadRequestException("Failed to send reset password email.");
        }

        _response.Message = "Password reset link sent to your email.";
        return Ok(_response);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
    {
        var result = await _authService.ResetPassword(resetPasswordDto);
        if (!result)
        {
            throw new BadRequestException("Password reset failed.");
        }

        _response.Message = "Password reset successfully.";
        return Ok(_response);
    }

    [HttpPost("assign-role")]
    [Authorize(Roles = SD.AdminRole)]
    public async Task<IActionResult> AssignRole([FromBody] AssignRoleDto model)
    {
        var assignRoleSuccessful = await _authService.AssignRole(model.Email, model.Role.ToUpper());
        if (!assignRoleSuccessful)
        {
            throw new BadRequestException("Error encountered");
        }

        _response.Message = "Assign role successfully.";
        return Ok(_response);
    }

    [HttpPost("signin-google")]
    public async Task<IActionResult> SignInGoogle([FromBody] LoginGoogleRequest request)
    {
        var response = await _authService.SignInWithGoogle(request.Token);

        // Thiết lập cookie
        CookieHelper.SetAuthCookie(Response, response.Token);

        _response.Message = "Login with Google successfully.";
        _response.Result = response;
        return Ok(_response);
    }


    [HttpPost("signin-facebook")]
    public async Task<IActionResult> SignInFacebook([FromBody] LoginGoogleRequest request)
    {
        var response = await _authService.SignInWithFacebook(request.Token);

        // Thiết lập cookie
        CookieHelper.SetAuthCookie(Response, response.Token);

        _response.Message = "Login with Facebook successfully.";
        _response.Result = response;
        return Ok(_response);
    }
}
