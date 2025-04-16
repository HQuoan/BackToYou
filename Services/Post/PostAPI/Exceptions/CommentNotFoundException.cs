namespace PostAPI.Exceptions;

public class CommentNotFoundException : NotFoundException
{
    public CommentNotFoundException(object key) : base("Comment", key)
    {
    }
}
