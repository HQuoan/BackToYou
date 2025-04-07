namespace BuildingBlocks.Models;
public abstract class BaseEntity : IBaseEntity
{
    public  DateTime? CreatedAt { get; set; }
    public  string? CreatedBy { get; set; }
    public  DateTime? LastModified { get; set; }
    public  string? LastModifiedBy { get; set; }
}
