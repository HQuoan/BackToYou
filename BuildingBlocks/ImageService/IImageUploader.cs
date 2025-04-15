using Microsoft.AspNetCore.Http;

namespace ImageService;
public interface IImageUploader
{
    Task<ImageUploadResult> UploadImageAsync(IFormFile file);
    Task<ImageUploadResult> DeleteImageAsync(string publicId);
}