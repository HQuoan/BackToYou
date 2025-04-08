namespace EmailService;

public interface IEmailService
{
    Task<ResponseEmailDto> SendEmailAsync(EmailRequest emailRequest);
}