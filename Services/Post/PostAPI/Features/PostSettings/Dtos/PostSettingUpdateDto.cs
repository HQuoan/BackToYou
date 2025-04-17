namespace PostAPI.Features.PostSettings.Dtos;
public class PostSettingUpdateDto
{
    public Guid PostSettingId { get; set; }
    public string Name { get; set; }
    public string Value { get; set; }
}
