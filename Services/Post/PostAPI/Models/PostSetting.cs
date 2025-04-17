namespace PostAPI.Models;

public class PostSetting
{
    [Key]
    public Guid PostSettingId { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public string Value { get; set; }
}
