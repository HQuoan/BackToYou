namespace PostAPI.Models;

public class Ward
{
    [Key]
    [MaxLength(20)]
    public string Code { get; set; }

    [Required]
    [MaxLength(255)]
    public string Name { get; set; }

    [MaxLength(255)]
    public string? NameEn { get; set; }

    [MaxLength(255)]
    public string? FullName { get; set; }

    [MaxLength(255)]
    public string? FullNameEn { get; set; }

    [MaxLength(255)]
    public string? CodeName { get; set; }

    [MaxLength(20)]
    public string? DistrictCode { get; set; }
    public District? District { get; set; }

    public int? AdministrativeUnitId { get; set; }
    public AdministrativeUnit? AdministrativeUnit { get; set; }
}
