using BuildingBlocks.Dtos;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace BuildingBlocks.Extensions;
public static class JwtBearerEventsFactory
{
    public static JwtBearerEvents Create()
    {
        return new JwtBearerEvents
        {
            OnChallenge = context =>
            {
                context.HandleResponse(); // Ngăn mặc định

                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Response.ContentType = "application/json";

                var problemDetails = new ProblemDetails
                {
                    Title = "Unauthorized",
                    Detail = "You are not authorized to access this resource.",
                    Status = StatusCodes.Status401Unauthorized,
                    Instance = context.Request.Path
                };
                problemDetails.Extensions.Add("traceId", context.HttpContext.TraceIdentifier);

                var response = new ResponseDto
                {
                    Result = problemDetails,
                    IsSuccess = false
                };

                var json = JsonSerializer.Serialize(response);
                return context.Response.WriteAsync(json);
            },

            OnForbidden = context =>
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                context.Response.ContentType = "application/json";

                var problemDetails = new ProblemDetails
                {
                    Title = "Forbidden",
                    Detail = "You do not have permission to access this resource.",
                    Status = StatusCodes.Status403Forbidden,
                    Instance = context.Request.Path
                };
                problemDetails.Extensions.Add("traceId", context.HttpContext.TraceIdentifier);

                var response = new ResponseDto
                {
                    Result = problemDetails,
                    IsSuccess = false
                };

                var json = JsonSerializer.Serialize(response);
                return context.Response.WriteAsync(json);
            }
        };
    }
}