﻿namespace PostAPI.Features.Categories.Dtos;

public class CategoryDto : BaseEntity
{
    public Guid CategoryId { get; set; }

    public string Name { get; set; }

    public string? Slug { get; set; }
}
