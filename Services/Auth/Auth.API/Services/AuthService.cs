using Auth.API.Exceptions;
using BuildingBlocks.Extensions;
using Google.Apis.Auth;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

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
            ShortName = registrationRequestDto.FullName.ToShortName(),
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
                string callBackUrl = _apiSettings.ConfirmEmailUrl;
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
                await _userManager.AddToRoleAsync(user, SD.CustomerRole);

                // Nếu gửi email thành công, trả về thông tin user
                UserDto userDto = new()
                {
                    Id = user.Id,
                    Email = user.Email,
                    FullName = user.FullName,
                    ShortName = user.ShortName,
                    PhoneNumber = user.PhoneNumber,
                    DateOfBirth = user.DateOfBirth,
                    Sex = user.Sex.ToString(),
                    Role = SD.CustomerRole,
                    GoogleId = user.GoogleId,
                    FacebookId = user.FacebookId,
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
            ShortName = user.ShortName,
            Avatar = user.Avatar,
            Sex = user.Sex.ToString(),
            DateOfBirth = user.DateOfBirth,
            Role = string.Join(", ", roles),
            GoogleId = user.GoogleId,
            FacebookId = user.FacebookId,
        };


        loginResponseDto.User = userDto;
        loginResponseDto.Token = token;


        return loginResponseDto;
    }

    public async Task<bool> ConfirmEmail(string userId, string token)
    {
        if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(token))
        {
            throw new BadRequestException("Invalid email confirmation request.");
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new UserNotFoundException(userId);
        }

        var result = await _userManager.ConfirmEmailAsync(user, token);
        if (result.Succeeded)
        {
            // Gửi email thông báo xác nhận thành công
            EmailRequest emailRequest = new EmailRequest
            {
                To = user.Email,
                Subject = "Email Confirmed Successfully!",
                Message = "Your email has been confirmed successfully. You can now log in to your account."
            };

            var emailResponse = await _emailService.SendEmailAsync(emailRequest);
            if (!emailResponse.IsSuccess)
            {
                throw new BadRequestException($"Email confirmation succeeded, but failed to send notification email: {emailResponse.Message}");
            }

            return true;
        }
        else
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new BadRequestException($"Email confirmation failed: {errors}");
        }
    }

    public async Task<bool> ChangePassword(string userId, ChangePasswordDto changePasswordDto)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new UserNotFoundException(userId);
        }

        if (user.PasswordHash == null)
        {
            throw new BadRequestException("Password change is not allowed for users who logged in with a Google account.");
        }

        // Kiểm tra mật khẩu cũ
        var passwordValid = await _userManager.CheckPasswordAsync(user, changePasswordDto.CurrentPassword);
        if (!passwordValid)
        {
            throw new BadRequestException("Current password is incorrect.");
        }

        // Kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp không
        if (changePasswordDto.NewPassword != changePasswordDto.ConfirmNewPassword)
        {
            throw new BadRequestException("New password and confirmation password do not match.");
        }

        // Thực hiện thay đổi mật khẩu
        var result = await _userManager.ChangePasswordAsync(user, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);
        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new BadRequestException($"Password change failed: {errors}");
        }

        return true;
    }

    public async Task<bool> ForgotPassword(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            throw new UserNotFoundException(email);
        }

        if (user.PasswordHash == null)
        {
            throw new BadRequestException("Password change is not allowed for users who logged in with a Google account.");
        }

        // Tạo token để đặt lại mật khẩu
        var token = await _userManager.GeneratePasswordResetTokenAsync(user);

        EmailRequest emailRequest = new EmailRequest()
        {
            To = user.Email,
            Subject = "Reset your password",
            Message = $"Your token: {token}"
        };

        var emailResponse = await _emailService.SendEmailAsync(emailRequest);

        if (!emailResponse.IsSuccess)
        {
            throw new BadRequestException($"Failed to send password reset email: {emailResponse.Message}");
        }

        return true;
    }

    public async Task<bool> ResetPassword(ResetPasswordDto resetPasswordDto)
    {
        var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);
        if (user == null)
        {
            throw new UserNotFoundException(resetPasswordDto.Email);
        }

        // Reset mật khẩu
        var result = await _userManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.NewPassword);
        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new BadRequestException($"Password reset failed: {errors}");
        }

        return true;
    }

    public async Task<bool> AssignRole(string email, string roleName)
    {
        var user = _db.ApplicationUsers.FirstOrDefault(c => c.Email.ToLower() == email.ToLower());

        if (user != null)
        {
            if (!_roleManager.RoleExistsAsync(roleName).GetAwaiter().GetResult())
            {
                //create role if it does not exit
                //_roleManager.CreateAsync(new IdentityRole(roleName)).GetAwaiter().GetResult();
                throw new BadRequestException("Role does not exist.");
            }
            await _userManager.AddToRoleAsync(user, roleName);

            return true;
        }

        return false;
    }


    public async Task<LoginResponseDto> SignInWithGoogle(string token)
    {

        // Xác thực mã token từ Google
        var payload = await VerifyGoogleToken(token);
        if (payload == null)
        {
            throw new BadRequestException("Invalid Google token.");
        }

        if (string.IsNullOrEmpty(payload.Email))
        {
            throw new BadRequestException("Unable to retrieve user email.");
        }

        // Kiểm tra nếu user đã tồn tại trong database, nếu không, tạo mới
        var user = await _userManager.FindByEmailAsync(payload.Email);

        if (user == null)
        {
            var fullName = payload.Name ?? payload.Email.Split('@')[0];
            user = new ApplicationUser
            {
                GoogleId = payload.JwtId,
                Email = payload.Email,
                NormalizedEmail = payload.Email.ToUpper(),
                UserName = payload.Email,
                FullName = fullName,
                ShortName = fullName.ToShortName(),
                Avatar = payload.Picture,
                Sex = SD.Male,
                DateOfBirth = new DateTime(2000, 1, 1),
                EmailConfirmed = true,
            };

            var result = await _userManager.CreateAsync(user);
            if (!result.Succeeded)
            {
                throw new BadRequestException($"Failed to register Google user: {string.Join("; ", result.Errors.Select(e => e.Description))}");
            }

            await _userManager.AddToRoleAsync(user, SD.CustomerRole);

            EmailRequest emailRequest = new EmailRequest()
            {
                To = user.Email,
                Subject = "Register Successfully!",
                Message = $"Register Successfully!"
            };

            var emailResponse = await _emailService.SendEmailAsync(emailRequest);
        }

        // Lấy các vai trò của user
        var roles = await _userManager.GetRolesAsync(user);

        // Tạo token JWT
        LoginResponseDto loginResponseDto = new LoginResponseDto();
        var tokenRespone = _jwtTokenGenerator.GenerateToken(user, roles);


        UserDto userDto = new()
        {
            Id = user.Id,
            PhoneNumber = user.PhoneNumber,
            Email = user.Email,
            FullName = user.FullName,
            ShortName = user.ShortName,
            Avatar = user.Avatar,
            Sex = user.Sex.ToString(),
            DateOfBirth = user.DateOfBirth,
            Role = string.Join(", ", roles),
            GoogleId = user.GoogleId,
            FacebookId = user.FacebookId,
        };

        loginResponseDto.User = userDto;
        loginResponseDto.Token = tokenRespone;

        return loginResponseDto;
    }

    private async Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(string token)
    {
        try
        {
            var validPayload = await GoogleJsonWebSignature.ValidateAsync(token);

            // Kiểm tra token hợp lệ bằng ClientId và Audience
            if (validPayload != null && validPayload.Issuer.ToString() == "https://accounts.google.com" && validPayload.Audience.ToString() == _apiSettings.Google.ClientId)
            {
                return validPayload;
            }
            return null;
        }
        catch (Exception ex)
        {
            return null;
        }
    }


    public async Task<LoginResponseDto> SignInWithFacebook(string accessToken)
    {
        // Verify Facebook access token
        var userInfo = await VerifyFacebookToken(accessToken);
        if (userInfo == null || string.IsNullOrEmpty(userInfo.Email))
        {
            throw new BadRequestException("Invalid Facebook token or unable to retrieve user email.");
        }

        // Check if user exists in the database, if not, create a new one
        var user = await _userManager.FindByEmailAsync(userInfo.Email);
        if (user == null)
        {
            var fullName = userInfo.Name ?? userInfo.Email.Split('@')[0];
            user = new ApplicationUser
            {
                Email = userInfo.Email,
                NormalizedEmail = userInfo.Email.ToUpper(),
                UserName = userInfo.Email,
                FullName = fullName,
                ShortName = fullName.ToShortName(),
                Avatar = userInfo.Picture.Data.Url, 
                FacebookId = userInfo.Id,
                Sex = SD.Male,
                DateOfBirth = new DateTime(2000, 1, 1),
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user);
            if (!result.Succeeded)
            {
                throw new BadRequestException($"Failed to register Facebook user: {string.Join("; ", result.Errors.Select(e => e.Description))}");
            }

            await _userManager.AddToRoleAsync(user, SD.CustomerRole);

            EmailRequest emailRequest = new EmailRequest
            {
                To = user.Email,
                Subject = "Register Successfully!",
                Message = "Register Successfully!"
            };

            await _emailService.SendEmailAsync(emailRequest);
        }

        // Get user roles
        var roles = await _userManager.GetRolesAsync(user);

        // Generate JWT token
        LoginResponseDto loginResponseDto = new LoginResponseDto();
        var tokenResponse = _jwtTokenGenerator.GenerateToken(user, roles);

        UserDto userDto = new()
        {
            Id = user.Id,
            PhoneNumber = user.PhoneNumber,
            Email = user.Email,
            FullName = user.FullName,
            ShortName = user.ShortName,
            Avatar = user.Avatar,
            Sex = user.Sex.ToString(),
            DateOfBirth = user.DateOfBirth,
            Role = string.Join(", ", roles),
            GoogleId = user.GoogleId,
            FacebookId = user.FacebookId,
        };

        loginResponseDto.User = userDto;
        loginResponseDto.Token = tokenResponse;

        return loginResponseDto;
    }

    private async Task<FacebookUserInfo> VerifyFacebookToken(string accessToken)
    {
        try
        {
            var httpClient = new HttpClient();
            //Step 1: Verify the access token
            var appAccessTokenUrl = $"https://graph.facebook.com/oauth/access_token?client_id={_apiSettings.Facebook.AppId}&client_secret={_apiSettings.Facebook.AppSecret}&grant_type=client_credentials";
            var appAccessTokenResponse = await httpClient.GetStringAsync(appAccessTokenUrl);
            var appAccessToken = JsonConvert.DeserializeObject<dynamic>(appAccessTokenResponse).access_token;

            //// Step 2: Debug the user access token
            var debugTokenUrl = $"https://graph.facebook.com/debug_token?input_token={accessToken}&access_token={appAccessToken}";
            var debugResponse = await httpClient.GetStringAsync(debugTokenUrl);
            var debugData = JsonConvert.DeserializeObject<dynamic>(debugResponse);

            if (debugData.data.is_valid != true || debugData.data.app_id != _apiSettings.Facebook.AppId)
            {
                throw new BadRequestException("Login with Facebook failed.");
            }

            // Step 3: Fetch user info
            var userInfoUrl = $"https://graph.facebook.com/me?fields=id,name,email,picture&access_token={accessToken}";
            var userInfoResponse = await httpClient.GetStringAsync(userInfoUrl);
            var userInfo = JsonConvert.DeserializeObject<FacebookUserInfo>(userInfoResponse);

            return userInfo;
        }
        catch
        {
            throw new BadRequestException("Login with Facebook failed.");
        }
    }

    // Helper class for Facebook user info
    public class FacebookUserInfo
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public PictureData Picture { get; set; }
    }

    public class PictureData
    {
        public Data Data { get; set; }
    }

    public class Data
    {
        public int Height { get; set; }
        public bool Is_Silhouette { get; set; }
        public string Url { get; set; }
        public int Width { get; set; }
    }
}
