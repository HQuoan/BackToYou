namespace BuildingBlocks.Exceptions;
public class BadRequestException : Exception
{
    public BadRequestException(string message) : base(message)
    {

    }

    public BadRequestException(string message, string details) : base(message)
    {
        Detaills = details;
    }
    public string? Detaills { get; }
}
