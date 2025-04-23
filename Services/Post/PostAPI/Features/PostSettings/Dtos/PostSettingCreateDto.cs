namespace PostAPI.Features.PostSettings.Dtos;
public class PostSettingCreateDto
{
    public string Name { get; set; }
    public string Value { get; set; }
}

public class PostSettingCreateDtoValidator : AbstractValidator<PostSettingCreateDto>
{
    public PostSettingCreateDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty();

        RuleFor(x => x.Value).NotEmpty();
    }
}

