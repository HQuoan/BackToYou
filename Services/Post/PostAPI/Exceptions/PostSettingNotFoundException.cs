namespace PostAPI.Exceptions;

public class PostSettingNotFoundException : NotFoundException
{
    public PostSettingNotFoundException(object key) : base("PostSetting", key)
    {
    }
}
