using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Auth.API.Models;

public class ApplicationUser : IdentityUser, IBaseEntity
{
    [Required]
    public string FullName { get; set; } = default!;
    [Required]
    public DateTime DateOfBirth { get; set; }
    [Required]
    public Sex Sex { get; set; }
    public string? Avatar { get; set; }
    public int CoinBalance { get; set; } = default!;
    public float ReputationScore { get; set; } = default!;

    public DateTime? CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? LastModified { get; set; }
    public string? LastModifiedBy { get; set; }
}
