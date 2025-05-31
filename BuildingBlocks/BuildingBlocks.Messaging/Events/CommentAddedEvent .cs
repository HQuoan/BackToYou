namespace BuildingBlocks.Messaging.Events;

public record CommentAddedEvent : IntegrationEvent
{
    public Guid CommentId { get; init; }
    public Guid PostId { get; init; }
    public string Slug { get; init; }
    public Guid? ParentCommentId { get; init; }
    public Guid CommenterId { get; init; }

    /// <summary>
    /// Danh sách người sẽ nhận thông báo (post owner, cha comment, …)
    /// </summary>
    public IReadOnlyList<Guid> RecipientUserIds { get; init; } = [];

    public string? Preview { get; init; }   // 40–50 ký tự đầu,
}
