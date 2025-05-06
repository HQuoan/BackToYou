namespace PostAPI.Models;

public class AdministrativeUnit
{
    [Key]
    public int Id { get; set; }

    [MaxLength(255)]
    public string? FullName { get; set; }

    [MaxLength(255)]
    public string? FullNameEn { get; set; }

    [MaxLength(255)]
    public string? ShortName { get; set; }

    [MaxLength(255)]
    public string? ShortNameEn { get; set; }

    [MaxLength(255)]
    public string? CodeName { get; set; }

    [MaxLength(255)]
    public string? CodeNameEn { get; set; }

    public ICollection<Province> Provinces { get; set; }
}
