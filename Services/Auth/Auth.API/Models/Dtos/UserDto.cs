namespace Auth.API.Models.Dtos;

public class UserDto
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string FullName { get; set; }
    public string ShortName { get; set; }
    public string? Avatar { get; set; }
    public string Sex { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string Role { get; set; }
    public string? FacebookId { get; set; }
    public string? GoogleId { get; set; }
}
