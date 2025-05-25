namespace PostAPI.Services;

public class PriorityDowngradeService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<PriorityDowngradeService> _logger;

    public PriorityDowngradeService(IServiceScopeFactory scopeFactory,
                                    ILogger<PriorityDowngradeService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // chạy vô hạn trừ khi app tắt
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var now = DateTime.Now;

                var expired = await db.Posts
                    .Where(p => p.PostLabel == PostLabel.Priority &&
                                p.PriorityStartAt != null &&
                                p.PriorityStartAt.Value.AddDays(p.PriorityDays ?? 0) <= now)
                    .ToListAsync(stoppingToken);

                if (expired.Any())
                {
                    foreach (var p in expired)
                    {
                        p.PostLabel = PostLabel.Normal;
                        p.PriorityStartAt = null;
                        p.PriorityDays = null;
                    }
                    await db.SaveChangesAsync(stoppingToken);
                    _logger.LogInformation("Downgraded {Count} expired priority posts.", expired.Count);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while downgrading priority posts.");
            }

            // chờ 1 giờ rồi quét lại
            await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
        }
    }
}

