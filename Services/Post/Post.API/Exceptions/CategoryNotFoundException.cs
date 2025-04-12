using BuildingBlocks.Exceptions;

namespace Post.API.Exceptions;

public class CategoryNotFoundException : NotFoundException
{
    public CategoryNotFoundException(object key) : base("Category", key)
    {
    }
}
