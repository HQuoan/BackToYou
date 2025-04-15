using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace ImageService;
public class CloudinaryUploader : IImageUploader
{
    private readonly Cloudinary _cloudinary;
    private readonly string _folderName;

    public CloudinaryUploader(IConfiguration config)
    {
        var account = new Account(
            config["Cloudinary:CloudName"],
            config["Cloudinary:ApiKey"],
            config["Cloudinary:ApiSecret"]
        );

         _folderName = config["Cloudinary:FolderName"];
        _cloudinary = new Cloudinary(account);
    }

    public async Task<ImageUploadResult> UploadImageAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return new ImageUploadResult
            {
                IsSuccess = false,
                ErrorMessage = "File is null or empty."
            };
        }

        try
        {
            await using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = _folderName
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
            {
                return new ImageUploadResult
                {
                    IsSuccess = true,
                    Url = uploadResult.SecureUrl?.ToString(),
                    PublicId = uploadResult.PublicId
                };
            }

            return new ImageUploadResult
            {
                IsSuccess = false,
                ErrorMessage = uploadResult.Error?.Message ?? "Upload failed for unknown reason."
            };
        }
        catch (Exception ex)
        {
            return new ImageUploadResult
            {
                IsSuccess = false,
                ErrorMessage = $"Exception: {ex.Message}"
            };
        }
    }


    public async Task<ImageUploadResult> DeleteImageAsync(string publicId)
    {
        if (string.IsNullOrWhiteSpace(publicId))
        {
            return new ImageUploadResult
            {
                IsSuccess = false,
                ErrorMessage = "PublicId is required."
            };
        }

        try
        {
            var deletionParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deletionParams);

            if (result.Result == "ok")
            {
                return new ImageUploadResult
                {
                    IsSuccess = true
                };
            }

            return new ImageUploadResult
            {
                IsSuccess = false,
                ErrorMessage = result.Error?.Message ?? $"Delete failed: {result.Result}"
            };
        }
        catch (Exception ex)
        {
            return new ImageUploadResult
            {
                IsSuccess = false,
                ErrorMessage = $"Exception: {ex.Message}"
            };
        }
    }

}