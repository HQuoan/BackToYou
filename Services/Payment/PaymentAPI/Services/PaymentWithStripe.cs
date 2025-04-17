using Stripe.Checkout;

namespace PaymentAPI.Services;
public class PaymentWithStripe : IPaymentMethod
{
    public string PaymentMethodName => SD.PaymentWithStripe;
    public async Task<PaymentSession> CreateSession(PaymentRequestDto paymentRequestDto, Receipt receipt)
    {
        var options = new SessionCreateOptions
        {
            SuccessUrl = paymentRequestDto.ApprovedUrl,
            CancelUrl = paymentRequestDto.CancelUrl,
            LineItems = new List<SessionLineItemOptions>(),
            Mode = "payment",
            CustomerEmail = receipt.Email
        };


        var sessionLineItem = new SessionLineItemOptions
        {
            PriceData = new SessionLineItemPriceDataOptions
            {
                UnitAmount = (long)(receipt.Amount * 100), // $20.99 -> 2099
                Currency = "usd",
                ProductData = new SessionLineItemPriceDataProductDataOptions
                {
                    Name = "BackToYou Wallet Top-up",
                    Description = $"Recharge balance for BackToYou account - ${receipt.Amount}",
                }
            },
            Quantity = 1
        };

        options.LineItems.Add(sessionLineItem);

        var service = new SessionService();
        var session = await service.CreateAsync(options);

        return new PaymentSession
        {
            Id = session.Id,
            Url = session.Url,
        };
    }


    public async Task<bool> ValidateSession(string sessionId)
    {
        var service = new SessionService();
        Session session = service.Get(sessionId);

        var paymentIntentService = new Stripe.PaymentIntentService();

        Stripe.PaymentIntent paymentIntent;
        try
        {
            paymentIntent = paymentIntentService.Get(session.PaymentIntentId);
        }
        catch (Exception)
        {
            throw new Exception("You have not completed the invoice payment.");
        }


        return paymentIntent.Status == "succeeded";
    }
}
