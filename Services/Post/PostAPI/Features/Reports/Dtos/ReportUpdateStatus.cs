namespace PostAPI.Features.Reports.Dtos;

public class ReportUpdateStatus
{
    public Guid ReportId { get; set; }
    public PostStatus Status { get; set; }
    public string? RejectionReason { get; set; }
}
