namespace PostAPI.Features.PostLabels.Queries;

public class PostLabelQueryParameters : BaseQueryParameters
{
    public string Name { get; set; }
    public decimal Price { get; set; }
}
