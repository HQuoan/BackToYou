namespace PostAPI.Exceptions;

public class FollowerNotFoundException : NotFoundException
{
    public FollowerNotFoundException(object key) : base("Follower", key)
    {
    }
}
