using System.ComponentModel.DataAnnotations;

namespace BuildingBlocks.Models;
public class Location
{
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    [Required]
    public string Ward { get; set; }
    [Required]
    public string District { get; set; }
    [Required]
    public string Province { get; set; }
    [Required]
    public string StreetAddress { get; set; }
}
