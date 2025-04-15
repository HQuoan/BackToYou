using BuildingBlocks.Dtos;
using BuildingBlocks.Utilities;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BuildingBlocks.Exceptions.Handler;

public class CustomExceptionHandler(ILogger<CustomExceptionHandler> logger)
    : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken cancellationToken)
    {
        logger.LogError(
            "Error Message: {exceptionMessage}, Time of occurrence {time}",
            exception.Message, DateTime.UtcNow);

        (string Detail, string Title, int StatusCode) details;

        // Xử lý riêng DbUpdateException để kiểm tra ràng buộc duy nhất
        if (exception is DbUpdateException dbEx && Util.IsUniqueConstraintViolation(dbEx))
        {
            var duplicateField = Util.ExtractDuplicateField(dbEx);
            exception = new DuplicateKeyException(duplicateField);
        }

        details = exception switch
        {
            InternalServerException => (
                exception.Message,
                nameof(InternalServerException),
                StatusCodes.Status500InternalServerError),

            ValidationException => (
                exception.Message,
                nameof(ValidationException),
                StatusCodes.Status400BadRequest),

            BadRequestException => (
                exception.Message,
                nameof(BadRequestException),
                StatusCodes.Status400BadRequest),

            NotFoundException => (
                exception.Message,
                nameof(NotFoundException),
                StatusCodes.Status404NotFound),

            ForbiddenException => (
                exception.Message,
                nameof(ForbiddenException),
                StatusCodes.Status403Forbidden),

            DuplicateKeyException => (
                exception.Message,
                nameof(DuplicateKeyException),
                StatusCodes.Status409Conflict),

            _ => (
                $"{exception.Message}{Environment.NewLine}{exception.InnerException}",
                exception.GetType().Name,
                StatusCodes.Status500InternalServerError)
        };

        var problemDetails = new ProblemDetails
        {
            Title = details.Title,
            Detail = details.Detail,
            Status = details.StatusCode,
            Instance = context.Request.Path,
        };

        problemDetails.Extensions.Add("traceId", context.TraceIdentifier);

        if (exception is ValidationException validationException)
        {
            problemDetails.Extensions.Add("ValidationErrors", validationException.Errors);
        }

        if (exception is DuplicateKeyException dupEx && dupEx.PropertyName is not null)
        {
            problemDetails.Extensions.Add("DuplicateField", dupEx.PropertyName);
        }

        context.Response.StatusCode = details.StatusCode;
        await context.Response.WriteAsJsonAsync(
            new ResponseDto { Result = problemDetails, IsSuccess = false },
            cancellationToken: cancellationToken);

        return true;
    }
}
