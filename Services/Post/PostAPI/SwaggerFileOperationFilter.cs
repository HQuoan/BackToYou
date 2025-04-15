using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace PostAPI;

public class SwaggerFileOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var hasFormFile = context.MethodInfo
            .GetParameters()
            .Any(p => p.ParameterType == typeof(IFormFile) ||
                      (p.ParameterType.IsGenericType &&
                       p.ParameterType.GetGenericTypeDefinition() == typeof(List<>) &&
                       p.ParameterType.GetGenericArguments()[0].GetProperty("ImageFile") != null));

        if (hasFormFile)
        {
            operation.RequestBody = new OpenApiRequestBody
            {
                Content = {
                    ["multipart/form-data"] = new OpenApiMediaType
                    {
                        Schema = new OpenApiSchema
                        {
                            Type = "object",
                            Properties = {
                                ["UserId"] = new OpenApiSchema { Type = "string", Format = "uuid" },
                                ["CategoryId"] = new OpenApiSchema { Type = "string", Format = "uuid" },
                                ["Title"] = new OpenApiSchema { Type = "string" },
                                ["Description"] = new OpenApiSchema { Type = "string" },
                                ["Location"] = new OpenApiSchema { Type = "object" }, // Cập nhật nếu Location có cấu trúc cụ thể
                                ["PostType"] = new OpenApiSchema { Type = "string" },
                                ["PostLabel"] = new OpenApiSchema { Type = "string" },
                                ["PostImages"] = new OpenApiSchema
                                {
                                    Type = "array",
                                    Items = new OpenApiSchema
                                    {
                                        Type = "object",
                                        Properties = {
                                            ["ImageFile"] = new OpenApiSchema
                                            {
                                                Type = "string",
                                                Format = "binary"
                                            },
                                            ["IsThumbnail"] = new OpenApiSchema
                                            {
                                                Type = "boolean"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };
        }
    }
}
