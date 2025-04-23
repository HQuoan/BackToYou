namespace PostAPI.Features.Posts.Dtos;

public class RefundDto
{
    public Guid UserId { get; set; }
    public decimal Amount { get; set; }
}


public class RefundDtoValidator : AbstractValidator<RefundDto>
{
    public RefundDtoValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();

        RuleFor(x => x.Amount)
            .GreaterThan(0)
            .WithMessage("Amount must be greater than 0.");
    }
}
