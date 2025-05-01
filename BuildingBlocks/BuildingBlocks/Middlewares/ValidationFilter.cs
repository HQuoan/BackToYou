using BuildingBlocks.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;

namespace BuildingBlocks.Middlewares;
public class ValidationFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.ModelState.IsValid)
        {
            var validationErrors = context.ModelState
                .Where(e => e.Value.Errors.Count > 0)
                .ToDictionary(
                    kvp => kvp.Key,
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
            problemDetails.Extensions.Add("ValidationErrors", validationErrors);

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
}