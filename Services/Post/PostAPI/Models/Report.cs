namespace PostAPI.Models;

public class Report : BaseEntity
{
    [Key]
    public Guid ReportId { get; set; }
    public Guid UserId { get; set; }
    public Guid? PostId { get; set; }
    public ReportTitle Title { get; set; }
    public string Description { get; set; }
    public PostStatus Status { get; set; }
    public string? RejectionReason { get; set; }
}
