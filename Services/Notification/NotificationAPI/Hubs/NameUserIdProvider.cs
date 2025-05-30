using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace NotificationAPI.Hubs;

public class NameUserIdProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection)
    {
        return connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }
}