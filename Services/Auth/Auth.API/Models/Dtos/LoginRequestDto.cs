using System.ComponentModel;

namespace Auth.API.Models.Dtos;

public class LoginRequestDto
{
    [DefaultValue("admin@gmail.com")]
    public string Email { get; set; }

    [DefaultValue("Admin@123")]
    public string Password { get; set; }
}

public class LoginRequestDtoValidator : AbstractValidator<LoginRequestDto>
{
    public LoginRequestDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.");

        RuleFor(x => x.Password).NotEmpty();
    }
}
