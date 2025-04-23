namespace PostAPI.Features.Followers.Dtos;

public class FollowerCreateDto
{
    public Guid PostId { get; set; }
}

public class FollowerCreateDtoValidator : AbstractValidator<FollowerCreateDto>
{
    public FollowerCreateDtoValidator()
    {
        RuleFor(x => x.PostId).NotEmpty();
    }
}

