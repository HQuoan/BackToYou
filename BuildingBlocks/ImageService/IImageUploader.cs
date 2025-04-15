using Microsoft.AspNetCore.Http;

namespace ImageService;
public interface IImageUploader
{
    Task<string> UploadImageAsync(IFormFile file);
    Task<bool> DeleteImageAsync(string publicId);
}