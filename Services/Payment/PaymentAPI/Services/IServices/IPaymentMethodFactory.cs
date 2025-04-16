namespace PaymentAPI.Services.IServices;

public interface IPaymentMethodFactory
{
    IPaymentMethod GetPaymentMethod(string paymentMethod);
}
