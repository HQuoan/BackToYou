using BuildingBlocks.Messaging.Events;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationAPI.Hubs;
using NotificationAPI.Repositories;

namespace NotificationAPI.Consumers;

public class CommentAddedConsumer : IConsumer<CommentAddedEvent>
{
    private readonly INotificationRepository _notificationRepo;
    private readonly IHubContext<NotificationHub> _hubContext;

    public CommentAddedConsumer(INotificationRepository notificationRepo, IHubContext<NotificationHub> hubContext = null)
    {
        _notificationRepo = notificationRepo;
        _hubContext = hubContext;
    }

    public async Task Consume(ConsumeContext<CommentAddedEvent> context)
    {
        var evt = context.Message;

        // Tạo Notification cho từng người nhận
        var notifications = evt.RecipientUserIds.Select(uid => new Notification
        {
            UserId = uid,
            Title = "Bình luận mới",
            Message = evt.Preview ?? "Có bình luận mới về bài viết của bạn",
            Url = $"/{evt.Slug}#comment-{evt.CommentId}",
        });

        await _notificationRepo.AddRangeAsync(notifications);
        await _notificationRepo.SaveAsync();

        // Gửi realtime notification tới client
        //foreach (var uid in evt.RecipientUserIds)
        //{
        //    await _hubContext.Clients.User(uid.ToString()).SendAsync("ReceiveNotification", new
        //    {
        //        Title = "Bình luận mới",
        //        Message = evt.Preview ?? "Có bình luận mới về bài viết của bạn",
        //        Url = $"/{evt.Slug}#comment-{evt.CommentId}",
        //    });
        //}

        await _hubContext.Clients.All.SendAsync("ReceiveNotification", new
        {
            Title = "Bình luận mới",
            Message = evt.Preview ?? "Có bình luận mới về bài viết của bạn",
            Url = $"/posts/{evt.PostId}#comment-{evt.CommentId}"
        });
    }
}
