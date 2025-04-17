using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Auth.API.Controllers;
[Route("auth")]
[ApiController]
public class AuthAPIController : ControllerBase
{
    private readonly IAuthService _authService;
    private ResponseDto _response;
    public AuthAPIController(IAuthService authService)
    {
        _authService = authService;
        _response = new();
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegistrationRequestDto model)
    {
        var userDto = await _authService.Register(model);
        _response.Result = userDto;

        return CreatedAtAction(nameof(Register), userDto);
    }

    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail(string userId, string token)
    {
        var result = await _authService.ConfirmEmail(userId, token);
        return Ok(new { message = "Email confirmed successfully." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto model)
    {
        var loginResponse = await _authService.Login(model);
        if (loginResponse.User == null)
        {
            throw new BadRequestException("Username or password is incorrect");
        }
        _response.Result = loginResponse;
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

        return Ok(new { Message = "Password changed successfully." });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(string email)
    {
        var result = await _authService.ForgotPassword(email);
        if (!result)
        {
            throw new BadRequestException("Failed to send reset password email.");
        }

        return Ok(new { Message = "Password reset link sent to your email." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
    {
        var result = await _authService.ResetPassword(resetPasswordDto);
        if (!result)
        {
            throw new BadRequestException("Password reset failed.");
        }

        return Ok(new { Message = "Password reset successfully." });

    }

    [HttpPost("AssignRole")]
    [Authorize(Roles = SD.AdminRole)]
    public async Task<IActionResult> AssignRole([FromBody] AssignRoleDto model)
    {
        var assignRoleSuccessful = await _authService.AssignRole(model.Email, model.Role.ToUpper());
        if (!assignRoleSuccessful)
        {
            throw new BadRequestException("Error encountered");
        }
        return Ok(_response);
    }

    [HttpPost("signin-google")]
    public async Task<IActionResult> SignInGoogle([FromBody] LoginGoogleRequest request)
    {
        //var authenticateResult = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
        //if (!authenticateResult.Succeeded)
        //{
        //  return BadRequest(new { message = "Google authentication failed." });
        //}
        try
        {
            var response = await _authService.SignInWithGoogle(request.Token);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
