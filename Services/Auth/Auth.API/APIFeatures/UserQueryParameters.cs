using BuildingBlocks.Dtos;

namespace Auth.API.APIFeatures;

public class UserQueryParameters : BaseQueryParameters
{
    public string? Email { get; set; }
    public string? FullName { get; set; }
    public string? Sex { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Role { get; set; }
}
