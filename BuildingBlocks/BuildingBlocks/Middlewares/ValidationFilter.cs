using BuildingBlocks.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

public class ValidationFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.ModelState.IsValid)
        {
            var policy = JsonNamingPolicy.CamelCase;

            var validationErrors = context.ModelState
                .Where(e => e.Value.Errors.Count > 0)
                .ToDictionary(
                    kvp => ConvertToCamelCase(kvp.Key, policy),
                    kvp => kvp.Value.Errors.Select(x => x.ErrorMessage).ToArray()
                );

            var problemDetails = new ProblemDetails
            {
                Title = "ValidationException",
                Detail = "One or more validation errors occurred.",
                Status = StatusCodes.Status400BadRequest,
                Instance = context.HttpContext.Request.Path
            };

            problemDetails.Extensions.Add("traceId", context.HttpContext.TraceIdentifier);
            problemDetails.Extensions.Add("validationErrors", validationErrors);

            context.Result = new JsonResult(new ResponseDto
            {
                IsSuccess = false,
                Result = problemDetails,
                Message = problemDetails.Detail,
            })
            {
                StatusCode = StatusCodes.Status400BadRequest
            };
        }
    }

    public void OnActionExecuted(ActionExecutedContext context) { }

    private static string ConvertToCamelCase(string key, JsonNamingPolicy policy)
    {
        // Tách các phần theo dấu chấm (.), ví dụ: PostContact.Name => ["PostContact", "Name"]
        var parts = key.Split('.');
        // Chuyển từng phần về camelCase rồi nối lại
        return string.Join(".", parts.Select(part => policy.ConvertName(part)));
    }
}
