namespace PostAPI.Features.PostSettings.Dtos;
public class PostSettingUpdateDto
{
    public Guid PostSettingId { get; set; }
    public string Name { get; set; }
    public string Value { get; set; }
}


public class PostSettingUpdateDtoValidator : AbstractValidator<PostSettingUpdateDto>
{
    public PostSettingUpdateDtoValidator()
    {
        RuleFor(x => x.PostSettingId).NotEmpty();

        RuleFor(x => x.Name).NotEmpty();

        RuleFor(x => x.Value).NotEmpty();
    }
}
