using System.ComponentModel.DataAnnotations;

namespace Auth.API.Models.Dtos;

public class AssignRoleDto
{
    [EmailAddress]
    public string Email { get; set; }
    public string Role { get; set; }
}
