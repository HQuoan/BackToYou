using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace BuildingBlocks.Utilities;
public static class Util
{
    public static bool IsUniqueConstraintViolation(DbUpdateException ex)
    {
        if (ex.InnerException != null)
        {
            var message = ex.InnerException.Message.ToLower();
            return message.Contains("duplicate key") || message.Contains("unique index");
        }
        return false;
    }

    public static string? ExtractDuplicateField(DbUpdateException ex)
    {
        // SQL Server thường có tên constraint trong message: IX_Category_Slug
        var message = ex.InnerException?.Message;
        if (message == null) return null;

        // Nếu tên constraint tuân theo chuẩn EF: IX_Table_Field
        var match = Regex.Match(message, @"IX_\w+_(\w+)");
        return match.Success ? match.Groups[1].Value : null;
    }

    public static string GetPublicIdFromUrl(string imageUrl)
    {
        if (string.IsNullOrEmpty(imageUrl)) return null;

        try
        {
            var uri = new Uri(imageUrl);
            var segments = uri.Segments;
            var filename = segments.Last(); // fa2n0uehjzqvmnbq6ir1.jpg
            var publicId = Path.GetFileNameWithoutExtension(filename);
            return publicId;
        }
        catch
        {
            return null;
        }
    }

}
