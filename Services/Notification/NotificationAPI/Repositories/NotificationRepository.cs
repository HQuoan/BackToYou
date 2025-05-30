namespace NotificationAPI.Repositories;

public class NotificationRepository : Repository<Notification>, INotificationRepository
{
    private readonly AppDbContext _db;
    public NotificationRepository(AppDbContext db) : base(db)
    {
        _db = db;
    }


    public async Task SaveAsync()
    {
        await _db.SaveChangesAsync();
    }
}

