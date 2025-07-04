﻿namespace PostAPI.Features.Categories.Dtos;

public class CategoryUpdateDto
{
    public Guid CategoryId { get; set; }
    public string Name { get; set; }
}

public class CategoryUpdateDtoValidator : AbstractValidator<CategoryUpdateDto>
{
    public CategoryUpdateDtoValidator()
    {
        RuleFor(x => x.CategoryId).NotEmpty();
        RuleFor(x => x.Name)
           .NotEmpty()
           .MaximumLength(17)
           .WithMessage("The category name cannot be longer than 18 characters.");
    }
}


