using PaymentAPI.Services.IServices;

namespace PaymentAPI.Services;

public class PaymentMethodFactory : IPaymentMethodFactory
{
    private readonly IEnumerable<IPaymentMethod> _paymentMethods;

    public PaymentMethodFactory(IEnumerable<IPaymentMethod> paymentMethods)
    {
        _paymentMethods = paymentMethods;
    }

    public IPaymentMethod GetPaymentMethod(string paymentMethod)
    {
        var selectedMethod = _paymentMethods.FirstOrDefault(pm => pm.PaymentMethodName == paymentMethod);
        return selectedMethod ?? throw new NotSupportedException($"Payment method {paymentMethod} is not supported.");
    }
}