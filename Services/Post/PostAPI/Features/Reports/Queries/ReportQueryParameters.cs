namespace PostAPI.Features.Reports.Queries;

public class ReportQueryParameters : BaseQueryParameters
{
    public Guid? UserId { get; set; }
    public string? UserEmail { get; set; }
    public Guid? PostId { get; set; }
    public ReportTitle? Title { get; set; }
    public PostStatus? Status { get; set; }
}
