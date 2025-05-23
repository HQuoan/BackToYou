namespace PostAPI.Features.Reports;

public class ReportRepository : Repository<Report>, IReportRepository
{
    public ReportRepository(AppDbContext db) : base(db)
    {
    }
}

