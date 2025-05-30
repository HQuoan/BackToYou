namespace NotificationAPI.Repositories;

public interface INotificationRepository : IRepository<Notification>
{
    Task SaveAsync();
}

