namespace PaymentAPI.Services.IServices;

public interface IPaymentService
{
    Task<string> CreateSession(PaymentRequestDto paymentRequestDto);
    Task<ResponseDto> ValidateSession(Guid receiptId);
}
