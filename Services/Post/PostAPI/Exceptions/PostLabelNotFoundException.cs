namespace PostAPI.Exceptions;

public class PostLabelNotFoundException : NotFoundException
{
    public PostLabelNotFoundException(object key) : base("PostLabel", key)
    {
    }
}
