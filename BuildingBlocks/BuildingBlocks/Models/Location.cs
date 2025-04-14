using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace BuildingBlocks.Models;
public class Location
{
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    [Required]
    [DefaultValue("Duy Tân")]
    public string Ward { get; set; }
    [Required]
    [DefaultValue("Duy Xuyên")]
    public string District { get; set; }
    [Required]
    [DefaultValue("Quảng Nam")]
    public string Province { get; set; }
    [Required]
    [DefaultValue("Tạp hóa cô Dung")]
    public string StreetAddress { get; set; }
}
