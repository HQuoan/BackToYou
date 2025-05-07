namespace Auth.API.Services;

public class ApiSettings
{
    public string WebClientUrl { get; set; }
    public string ConfirmEmailUrl { get; set; }
    public GoogleSettings Google { get; set; }
    public FacebookSettings Facebook { get; set; }
}