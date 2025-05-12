using System.ComponentModel;

namespace Auth.API.Models.Dtos;

public class UserInformation
{
    [DefaultValue(null)]
    public string? Id { get; set; }

    public string? FullName { get; set; }
    public string? PhoneNumber { get; set; }

    [DefaultValue(SD.Male)]
    public string Sex { get; set; } = SD.Male;

    public DateTime DateOfBirth { get; set; }
}
