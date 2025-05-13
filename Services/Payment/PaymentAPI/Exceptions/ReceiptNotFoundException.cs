namespace PaymentAPI.Exceptions;

public class ReceiptNotFoundException : NotFoundException
{
    public ReceiptNotFoundException(object key) : base("Receipt", key)
    {
    }
}
