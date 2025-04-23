using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Auth.API.Models;

public class ApplicationUser : IdentityUser, IBaseEntity
{
    [Required]
    public string FullName { get; set; }
    public string ShortName { get; set; }
    [Required]
    public DateTime DateOfBirth { get; set; }
    [Required]
    public string Sex { get; set; }
    public string? Avatar { get; set; }
    public int CoinBalance { get; set; } = default!;
    public float ReputationScore { get; set; } = default!;

    [NotMapped]
    public string? Role { get; set; }

    public DateTime? CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? LastModified { get; set; }
    public string? LastModifiedBy { get; set; }
}
