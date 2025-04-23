namespace PostAPI.Features.Categories.Dtos;

public class CategoryCreateDto
{
    public string Name { get; set; }
}

public class CategoryCreateDtoValidator : AbstractValidator<CategoryCreateDto>
{
    public CategoryCreateDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(18)
            .WithMessage("The category name cannot be longer than 18 characters.");
    }
}


