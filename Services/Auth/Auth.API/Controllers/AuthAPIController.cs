using BuildingBlocks.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Auth.API.Controllers;
[Route("api/auth")]
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

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto model)
    {
        var loginResponse = await _authService.Login(model);
        if (loginResponse.User == null)
        {
            _response.IsSuccess = false;
            _response.Message = "Username or password is incorrect";
            return BadRequest(_response);
        }
        _response.Result = loginResponse;
        return Ok(_response);
    }
}
