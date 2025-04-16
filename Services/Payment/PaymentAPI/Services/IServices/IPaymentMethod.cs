using PaymentAPI.Models.Dtos;
using PaymentAPI.Models;

namespace PaymentAPI.Services.IServices;

public interface IPaymentMethod
{
    string PaymentMethodName { get; }
    Task<PaymentSession> CreateSession(PaymentRequestDto paymentRequestDto, Receipt receipt);
    Task<bool> ValidateSession(string receiptId);
}