namespace PostAPI.Exceptions;

public class PostNotFoundException : NotFoundException
{
    public PostNotFoundException(object key) : base("Post", key)
    {
    }
}
