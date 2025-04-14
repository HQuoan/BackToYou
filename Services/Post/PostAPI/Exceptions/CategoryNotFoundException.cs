using BuildingBlocks.Exceptions;

namespace PostAPI.Exceptions;

public class CategoryNotFoundException : NotFoundException
{
    public CategoryNotFoundException(object key) : base("Category", key)
    {
    }
}
