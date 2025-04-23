namespace Auth.API.Models.Dtos;

public class ResetPasswordDto
{
    public string Email { get; set; }

    public string Token { get; set; }

    public string NewPassword { get; set; }

    public string ConfirmNewPassword { get; set; }
}


public class ResetPasswordDtoValidator : AbstractValidator<ResetPasswordDto>
{
    public ResetPasswordDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email address.");

        RuleFor(x => x.Token)
            .NotEmpty().WithMessage("Token is required.");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("New password is required.")
            .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$")
            .WithMessage("Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.")
            .MinimumLength(8).WithMessage("Password must be between 8 and 100 characters.")
            .MaximumLength(100).WithMessage("Password must be between 8 and 100 characters.");

        RuleFor(x => x.ConfirmNewPassword)
            .NotEmpty().WithMessage("Please confirm your new password.")
            .Equal(x => x.NewPassword).WithMessage("The password and confirmation password do not match.");
    }
}
