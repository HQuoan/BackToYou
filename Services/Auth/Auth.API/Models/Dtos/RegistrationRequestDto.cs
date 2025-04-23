using System.ComponentModel;

namespace Auth.API.Models.Dtos;

public class RegistrationRequestDto
{
    public string Email { get; set; }

    [DefaultValue("123456789")]
    public string PhoneNumber { get; set; }

    public string FullName { get; set; }

    [DefaultValue("User@123")]
    public string Password { get; set; }

    [DefaultValue("User@123")]
    public string ConfirmPassword { get; set; }

    [DefaultValue(SD.Male)]
    public string Sex { get; set; } = SD.Male;

    public DateTime DateOfBirth { get; set; }
}


public class RegistrationRequestDtoValidator : AbstractValidator<RegistrationRequestDto>
{
    public RegistrationRequestDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email address.");

        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("PhoneNumber is required.")
            .Matches(@"^\d{9,}$").WithMessage("Invalid phone number")
            .WithMessage("Phone number must contain only numbers and be at least 9 digits.");

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("FullName is required.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$")
            .WithMessage("Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.")
            .MinimumLength(8).WithMessage("Password must be between 8 and 100 characters.")
            .MaximumLength(100).WithMessage("Password must be between 8 and 100 characters.");

        RuleFor(x => x.ConfirmPassword)
            .NotEmpty().WithMessage("Please confirm your password.")
            .Equal(x => x.Password).WithMessage("The password and confirmation password do not match.");

        RuleFor(x => x.Sex)
            .NotEmpty().WithMessage("Sex is required.");

        RuleFor(x => x.DateOfBirth)
            .NotEmpty().WithMessage("Date of Birth is required.")
            .LessThan(DateTime.Now).WithMessage("Date of birth cannot be in the future.");
    }
}

