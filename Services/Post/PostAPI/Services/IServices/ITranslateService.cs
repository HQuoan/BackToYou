namespace PostAPI.Services.IServices;

public interface ITranslateService
{
    Task<string> TranslateToEnglishAsync(string text);
}
