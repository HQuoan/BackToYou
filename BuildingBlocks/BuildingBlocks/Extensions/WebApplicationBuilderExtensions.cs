using BuildingBlocks.Dtos;
using BuildingBlocks.Utilities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;

namespace BuildingBlocks.Extensions;
public static class WebApplicationBuilderExtensions
{
    public static WebApplicationBuilder AddAppAuthentication(this WebApplicationBuilder builder)
    {
        var secret = builder.Configuration.GetValue<string>("ApiSettings:Secret");
        var issuer = builder.Configuration.GetValue<string>("ApiSettings:Issuer");
        var audience = builder.Configuration.GetValue<string>("ApiSettings:Audience");

        var key = Encoding.ASCII.GetBytes(secret);

        builder.Services.AddAuthentication(x =>
        {
            x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(x =>
        {
            x.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = issuer,
                ValidateAudience = true,
                ValidAudience = audience,
            };

            // xử lý event
            //x.Events = JwtBearerEventsFactory.Create();

            x.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    // Nếu header Authorization đã có, thì ưu tiên header
                    var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
                    if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
                    {
                        return Task.CompletedTask;
                    }

                    // Nếu không có header -> thử lấy từ Cookie
                    var accessToken = context.Request.Cookies[SD.AccessTokenCookieName];
                    if (!string.IsNullOrEmpty(accessToken))
                    {
                        context.Token = accessToken;
                    }

                    return Task.CompletedTask;
                },

                OnChallenge = context =>
                {
                    // Ngăn ASP.NET trả về lỗi 401 mặc định
                    context.HandleResponse();

                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    context.Response.ContentType = "application/json";

                    var response = new ResponseDto
                    {
                        IsSuccess = false,
                        Message = "You are not logged in or your session has expired.",
                        Result = null
                    };

                    var json = JsonSerializer.Serialize(response);

                    return context.Response.WriteAsync(json);
                }
            };
        });

        return builder;
    }
}