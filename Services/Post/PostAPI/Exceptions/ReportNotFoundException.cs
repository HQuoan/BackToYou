namespace PostAPI.Exceptions;

public class ReportNotFoundException : NotFoundException
{
    public ReportNotFoundException(object key) : base("Report", key)
    {
    }
}
