using System.ComponentModel;

namespace Auth.API.Models.Dtos;

public class LoginRequestDto
{
    [DefaultValue("admin@gmail.com")]
    public string Email { get; set; }

    [DefaultValue("Admin@123")]
    public string Password { get; set; }
}
