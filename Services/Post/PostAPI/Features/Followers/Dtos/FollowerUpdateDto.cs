namespace PostAPI.Features.Followers.Dtos;

public class FollowerUpdateDto
{
    public Guid FollowerId { get; set; }
    public bool IsSubscribed { get; set; }

}

public class FollowerUpdateDtoValidator : AbstractValidator<FollowerUpdateDto>
{
    public FollowerUpdateDtoValidator()
    {
        RuleFor(x => x.FollowerId).NotEmpty();
    }
}
