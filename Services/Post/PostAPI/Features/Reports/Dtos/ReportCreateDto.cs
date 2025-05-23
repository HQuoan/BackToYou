namespace PostAPI.Features.Reports.Dtos;

public class ReportCreateDto
{
    public Guid? PostId { get; set; }
    public ReportTitle Title { get; set; }
    public string Description { get; set; }
}

public class ReportCreateDtoValidator : AbstractValidator<ReportCreateDto>
{
    public ReportCreateDtoValidator()
    {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.Description).NotEmpty();
    }
}
