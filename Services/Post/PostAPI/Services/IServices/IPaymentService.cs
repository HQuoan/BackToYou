using PostAPI.Features.Posts.Dtos;

namespace PostAPI.Services.IServices;

public interface IPaymentService
{
    Task<bool> SubtractBalance(decimal amount);
    Task<bool> Refund(RefundDto refundDto);
}
