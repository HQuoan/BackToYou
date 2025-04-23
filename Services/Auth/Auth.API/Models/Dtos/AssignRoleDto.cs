namespace Auth.API.Models.Dtos;

public class AssignRoleDto
{
    public string Email { get; set; }
    public string Role { get; set; }
}

public class AssignRoleDtoValidator : AbstractValidator<AssignRoleDto>
{
    public AssignRoleDtoValidator()
    {
        RuleFor(x => x.Email)
          .NotEmpty()
          .EmailAddress().WithMessage("Invalid email format.");

        RuleFor(x => x.Role).NotEmpty();
    }
}
