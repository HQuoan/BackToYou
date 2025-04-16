namespace PaymentAPI.Services;
public class PaymentService : IPaymentService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailService _emailService;
    private readonly IMapper _mapper;
    private readonly IPaymentMethodFactory _paymentMethodFactory;

    public PaymentService(IUnitOfWork unitOfWork, IEmailService emailService, IMapper mapper, IPaymentMethodFactory paymentMethodFactory)
    {
        _unitOfWork = unitOfWork;
        _emailService = emailService;
        _mapper = mapper;
        _paymentMethodFactory = paymentMethodFactory;
    }

    public async Task<string> CreateSession(PaymentRequestDto paymentRequestDto)
    {
        Receipt receiptFromDb = await _unitOfWork.Receipt.GetAsync(c => c.ReceiptId == paymentRequestDto.ReceiptId, tracked: true);

        if (receiptFromDb == null)
        {
            throw new ReceiptNotFoundException(paymentRequestDto.ReceiptId);
        }


        if (receiptFromDb.Status == SD.Status_Session_Created)
        {
            return receiptFromDb.PaymentSessionUrl;
        }

        if (receiptFromDb.Status == SD.Status_Approved)
        {
            throw new BadRequestException("The receipt  has already been paid.");
        }


        var paymentMethod = _paymentMethodFactory.GetPaymentMethod(receiptFromDb.PaymentMethod);

        var session = await paymentMethod.CreateSession(paymentRequestDto, receiptFromDb);

        // Cap nhat 
        receiptFromDb.StripeSessionId = session.Id;
        receiptFromDb.PaymentSessionUrl = session.Url;
        receiptFromDb.Status = SD.Status_Session_Created;

        await _unitOfWork.SaveAsync();

        return session.Url;
    }

    public async Task<ResponseDto> ValidateSession(Guid receiptId)
    {
        ResponseDto responseDto = new ResponseDto();
        Receipt receipt = await _unitOfWork.Receipt.GetAsync(c => c.ReceiptId == receiptId);
        if (receipt == null)
        {
            throw new NotFoundException($"Receipt with ID: {receiptId} not found.");
        }

        if (receipt.Status == SD.Status_Approved)
        {
            responseDto.IsSuccess = true;
            responseDto.Message = "The receipt has been paid.";

            return responseDto;
        }
        else if (receipt.Status == SD.Status_Session_Created)
        {
            var paymentMethod = _paymentMethodFactory.GetPaymentMethod(receipt.PaymentMethod);
            if (await paymentMethod.ValidateSession(receipt.StripeSessionId))
            {
                // Payment successful
                //receipt.PaymentIntentId = paymentIntent.Id;
                receipt.Status = SD.Status_Approved;
                receipt.PaymentSessionUrl = null;

                await _unitOfWork.Receipt.UpdateAsync(receipt);
                await _unitOfWork.SaveAsync();

                // Create or update Wallet
                Wallet walletFromDb = await _unitOfWork.Wallet.GetAsync(c => c.UserId == receipt.UserId);
                Wallet walletToReturn;

                if (walletFromDb == null)
                {
                    // Create new wallet
                    var newWallet = new Wallet
                    {
                        UserId = receipt.UserId,
                        Balance = receipt.Amount
                    };

                    await _unitOfWork.Wallet.AddAsync(newWallet);
                    walletToReturn = newWallet;
                }
                else
                {
                    walletFromDb.Balance += receipt.Amount;

                    await _unitOfWork.Wallet.UpdateAsync(walletFromDb);
                    walletToReturn = walletFromDb;
                }

                await _unitOfWork.SaveAsync();

                // Tạo một object ẩn danh chứa cả receipt và membership
                var result = new
                {
                    Receipt = _mapper.Map<ReceiptDto>(receipt),
                    Wallet = _mapper.Map<WalletDto>(walletToReturn)
                };

                // Gửi email gia hạn gói thành công 
                var responeSendMail = await _emailService.SendEmailAsync(new EmailRequest
                {
                    //To = membershipToReturn.UserEmail,
                    To = receipt.Email,
                    Subject = "Payment Successful",
                    //Message = GenerateEmailBody.PaymentSuccess(receipt, package, membershipToReturn)
                    Message = ""
                });

                responseDto.Result = new
                {
                    result,
                    responeSendMail
                };
            }
            else
            {
                // Nếu thanh toán không thành công
                responseDto.IsSuccess = false;
                responseDto.Message = "Payment failed. Please try again.";
            }
        }

        return responseDto;
    }
}
