namespace PostAPI.Features.Categories.Queries;

public class CategoryQueryParameters : BaseQueryParameters
{
    public string? Name { get; set; }
    public string? Slug { get; set; }
}
