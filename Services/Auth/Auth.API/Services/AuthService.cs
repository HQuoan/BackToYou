using BuildingBlocks.Exceptions;
using Microsoft.Extensions.Options;

namespace Auth.API.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ApiSettings _apiSettings;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IEmailService _emailService;
    public AuthService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IOptions<ApiSettings> apiSettings, AppDbContext db, IEmailService emailService, IJwtTokenGenerator jwtTokenGenerator)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _apiSettings = apiSettings.Value;
        _db = db;
        _emailService = emailService;
        _jwtTokenGenerator = jwtTokenGenerator;
    }
    public async Task<UserDto> Register(RegistrationRequestDto registrationRequestDto)
    {
        ApplicationUser user = new()
        {
            Email = registrationRequestDto.Email,
            NormalizedEmail = registrationRequestDto.Email.ToUpper(),
            PhoneNumber = registrationRequestDto.PhoneNumber,
            FullName = registrationRequestDto.FullName,
            UserName = registrationRequestDto.Email,
            Sex = registrationRequestDto.Sex,
            DateOfBirth = registrationRequestDto.DateOfBirth,
        };

        try
        {
            var result = await _userManager.CreateAsync(user, registrationRequestDto.Password);
            if (result.Succeeded)
            {
                // Tạo token và link xác nhận
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                string callBackUrl = $"{_apiSettings.BaseUrl}/api/auth/confirm-email";
                var confirmationLink = $"{callBackUrl}?userId={user.Id}&token={Uri.EscapeDataString(token)}";

                // Gửi email
                EmailRequest emailRequest = new EmailRequest()
                {
                    To = user.Email,
                    Subject = "Confirm your email",
                    Message = $"Please confirm your account by clicking this link: <a href='{confirmationLink}'>Confirm Email</a>"
                };

                var emailResponse = await _emailService.SendEmailAsync(emailRequest);

                if (!emailResponse.IsSuccess)
                {
                    await _userManager.DeleteAsync(user);
                    throw new BadRequestException($"Registration failed: {emailResponse.Message}");
                }

                // Gán role mặc định là CUSTOMER
                await _userManager.AddToRoleAsync(user, Role.CUSTOMER.ToString());

                // Nếu gửi email thành công, trả về thông tin user
                UserDto userDto = new()
                {
                    Id = user.Id,
                    Email = user.Email,
                    FullName = user.FullName,
                    PhoneNumber = user.PhoneNumber,
                    DateOfBirth = user.DateOfBirth,
                    Sex = user.Sex.ToString(),
                    Role = Role.CUSTOMER.ToString(),
                };

                return userDto;
            }
            else
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                throw new BadRequestException($"Registration failed: {errors}");
            }
        }
        catch (Exception ex)
        {
            throw new BadRequestException($"An error occurred during registration. {ex.Message}");
        }

    }

    public async Task<LoginResponseDto> Login(LoginRequestDto loginRequestDto)
    {
        var user = _db.ApplicationUsers.FirstOrDefault(c => c.Email.ToLower() == loginRequestDto.Email.ToLower());

        bool isValid = await _userManager.CheckPasswordAsync(user, loginRequestDto.Password);

        if (user == null || isValid == false)
        {
            return new LoginResponseDto() { User = null, Token = "" };
        }

        if (!user.EmailConfirmed)
        {
            throw new BadRequestException("Please confirm your email to login.");
        }

        LoginResponseDto loginResponseDto = new LoginResponseDto();

        // if user was found, Generate JWT Token
        var roles = await _userManager.GetRolesAsync(user);
        var token = _jwtTokenGenerator.GenerateToken(user, roles);

        UserDto userDto = new()
        {
            Id = user.Id,
            PhoneNumber = user.PhoneNumber,
            Email = user.Email,
            FullName = user.FullName,
            Avatar = user.Avatar,
            Sex = user.Sex.ToString(),
            DateOfBirth = user.DateOfBirth,
            Role = string.Join(", ", roles),
        };


        loginResponseDto.User = userDto;
        loginResponseDto.Token = token;


        return loginResponseDto;
    }
}
