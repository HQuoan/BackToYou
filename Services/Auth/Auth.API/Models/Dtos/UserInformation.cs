namespace Auth.API.Models.Dtos;

public class UserInformation
{
    public string? Id { get; set; }

    public string FullName { get; set; }

    public string? Avatar { get; set; }

    public string Sex { get; set; }

    public DateTime DateOfBirth { get; set; }
}
