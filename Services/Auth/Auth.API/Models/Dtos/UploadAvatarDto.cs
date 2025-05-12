using System.ComponentModel.DataAnnotations;

namespace Auth.API.Models.Dtos;

public class UploadAvatarDto
{
    [Required]
    public IFormFile Avatar { get; set; }
}

