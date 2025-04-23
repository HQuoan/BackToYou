namespace BuildingBlocks.Extensions;
public static class StringExtensions
{
    public static string ToShortName(this string fullName)
    {
        if (string.IsNullOrWhiteSpace(fullName)) return string.Empty;

        var words = fullName.Trim().ToLowerInvariant().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (words.Length == 0) return string.Empty;

        var lastTwoWords = words.Skip(Math.Max(0, words.Length - 2));
        var combined = string.Join("", lastTwoWords);

        return RemoveDiacritics(combined);
    }

    private static string RemoveDiacritics(string text)
    {
        var normalized = text.Normalize(System.Text.NormalizationForm.FormD);
        var sb = new System.Text.StringBuilder();
        foreach (var c in normalized)
        {
            if (System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c) != System.Globalization.UnicodeCategory.NonSpacingMark)
                sb.Append(c);
        }
        return sb.ToString().Normalize(System.Text.NormalizationForm.FormC);
    }
}