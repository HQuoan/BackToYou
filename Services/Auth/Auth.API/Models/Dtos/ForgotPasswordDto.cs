using System.ComponentModel.DataAnnotations;

namespace Auth.API.Models.Dtos;

public class ForgotPasswordDto
{
    [EmailAddress]
    public string Email { get; set; }
}
