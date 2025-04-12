namespace BuildingBlocks.Exceptions;
public class DuplicateKeyException : Exception
{
    public string? PropertyName { get; }

    public DuplicateKeyException(string? propertyName = null)
        : base(propertyName is not null
            ? $"The value for `{propertyName}` already exists."
            : "A unique constraint was violated.")
    {
        PropertyName = propertyName;
    }
}

