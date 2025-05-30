namespace BuildingBlocks.Messaging.Events;
public record IntegrationEvent
{
    public Guid Id => Guid.NewGuid();
    public DateTime OccurredON => DateTime.Now;
    public string EvenType => GetType().AssemblyQualifiedName;
}
