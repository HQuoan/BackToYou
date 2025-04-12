namespace Post.API.APIFeatures;

public class CategoryQueryParameters : BaseQueryParameters
{
    public string? Name { get; set; }
    public string? Slug { get; set; }
}
