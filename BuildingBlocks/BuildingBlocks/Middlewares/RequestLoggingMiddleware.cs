using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace BuildingBlocks.Middlewares;
public class RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        logger.LogInformation("[START] {Method} {Path}", context.Request.Method, context.Request.Path);

        var stopwatch = Stopwatch.StartNew();

        await next(context);

        stopwatch.Stop();

        if (stopwatch.Elapsed.TotalSeconds > 3)
        {
            logger.LogWarning("[PERFORMANCE] {Method} {Path} took {ElapsedSeconds} seconds",
                context.Request.Method, context.Request.Path, stopwatch.Elapsed.TotalSeconds);
        }

        logger.LogInformation("[END] {Method} {Path} - StatusCode: {StatusCode}",
            context.Request.Method, context.Request.Path, context.Response.StatusCode);
    }
}