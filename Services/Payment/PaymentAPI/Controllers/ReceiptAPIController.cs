using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace PaymentAPI.Controllers;

[Route("receipts")]
[ApiController]
//[Authorize]
public class ReceiptAPIController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private ResponseDto _response;
    //private readonly IUserService _userService;
    private readonly IPaymentService _paymentService;

    public ReceiptAPIController(IUnitOfWork unitOfWork, IMapper mapper,  IPaymentService paymentService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _response = new ResponseDto();
        _paymentService = paymentService;
    }

    //[HttpGet]
    //[Route("ReceiptStat")]
    //public async Task<ActionResult<ResponseDto>> ReceiptStat([FromQuery] TimePeriod timePeriod)
    //{
    //    QueryParameters<Receipt> query = new QueryParameters<Receipt>();
    //    query.Filters.Add(m => m.Status == SD.Status_Approved);
    //    query.Filters.Add(m => m.CreatedAt >= timePeriod.From && m.CreatedAt <= timePeriod.To);

    //    IEnumerable<Receipt> receipts = await _unitOfWork.Receipt.GetAllAsync(query);

    //    var receiptStat = receipts
    //      .GroupBy(c => c.PackageId)
    //      .Select(group =>
    //      {
    //          var first = group.First();
    //          return new ReceiptStatResultDto
    //          {
    //              PackageId = group.Key,
    //              TermInMonths = first.TermInMonths,
    //              PackagePrice = first.PackagePrice,
    //              Count = group.Count(),
    //          };
    //      }).ToList();

    //    // Calculate Total Revenue
    //    var revenue = receiptStat.Sum(c => c.Total);

    //    _response.Result = new
    //    {
    //        revenue,
    //        receiptStat
    //    };

    //    return Ok(_response);
    //}

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<ResponseDto>> Get([FromQuery] ReceiptQueryParameters queryParameters)
    {
        var query = ReceiptFeatures.Build(queryParameters);
        IEnumerable<Receipt> receipts = await _unitOfWork.Receipt.GetAllAsync(query);
        _response.Result = _mapper.Map<IEnumerable<ReceiptDto>>(receipts);

        int totalItems = await _unitOfWork.Receipt.CountAsync(query);
        _response.Pagination = new PaginationDto
        {
            TotalItems = totalItems,
            TotalItemsPerPage = queryParameters.PageSize,
            CurrentPage = queryParameters.PageNumber,
            TotalPages = (int)Math.Ceiling((double)totalItems / queryParameters.PageSize)
        };


        return Ok(_response);
    }

    [HttpGet]
    [Route("{id:int}")]
    public async Task<ActionResult<ResponseDto>> Get(Guid id)
    {
        var receipt = await _unitOfWork.Receipt.GetAsync(c => c.ReceiptId == id);
        if (receipt == null)
        {
            throw new ReceiptNotFoundException(id);
        }

        _response.Result = _mapper.Map<ReceiptDto>(receipt);
        return Ok(_response);
    }

    [HttpGet("{userId}")]
    public async Task<ActionResult<ResponseDto>> GetReceiptsByUserId(Guid userId)
    {
        var query = new QueryParameters<Receipt>();
        query.Filters.Add(c => c.UserId == userId);

        IEnumerable<Receipt> receipts = await _unitOfWork.Receipt.GetAllAsync(query);

        _response.Result = _mapper.Map<IEnumerable<ReceiptDto>>(receipts);

        return Ok(_response);
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<ResponseDto>> GetOrdersByMe()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }

        var query = new QueryParameters<Receipt>();
        query.Filters.Add(c => c.UserId == userId);

        IEnumerable<Receipt> receipts = await _unitOfWork.Receipt.GetAllAsync(query);

        _response.Result = _mapper.Map<IEnumerable<ReceiptDto>>(receipts);

        return Ok(_response);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ResponseDto>> Post([FromBody] ReceiptCreateDto receiptDto)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }

        //bool isExistUser = await _userService.IsExistUser(receiptDto.UserId);
        //if (!isExistUser)
        //{
        //    throw new NotFoundException($"User with ID: {receiptDto.UserId} not found.");
        //}

        //if(userId == receiptDto.UserId)
        //{
        //    throw new ForbiddenException("You're not allowed to create a receipt for someone else.");
        //}

        Receipt receipt = _mapper.Map<Receipt>(receiptDto);
        receipt.UserId = userId;
        receipt.Email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email).Value;
        receipt.Status = SD.Status_Pending;

        await _unitOfWork.Receipt.AddAsync(receipt);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<ReceiptDto>(receipt);

        return CreatedAtAction(nameof(Get), new { id = receipt.ReceiptId }, _response);
    }

    [HttpPost("CreateSession")]
    public async Task<ActionResult<ResponseDto>> CreateSession([FromBody] PaymentRequestDto paymentRequestDto)
    {
        var paymentSessionUrl = await _paymentService.CreateSession(paymentRequestDto);
        paymentRequestDto.PaymentSessionUrl = paymentSessionUrl;
        _response.Result = paymentRequestDto;
        _response.Message = "Payment link created successfully.";

        return Ok(_response);
    }

    [HttpPost("ValidateSession/{receiptId}")]
    public async Task<ActionResult<ResponseDto>> ValidateSession(Guid receiptId)
    {
        return Ok(await _paymentService.ValidateSession(receiptId));
    }

    [HttpDelete]
    [Authorize]
    public async Task<ActionResult<ResponseDto>> Delete(Guid id)
    {
        Receipt receipt = await _unitOfWork.Receipt.GetAsync(c => c.ReceiptId == id);
        if (receipt == null)
        {
            throw new NotFoundException($"Receipt with ID: {id} not found.");
        }

        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }

        if (!(User.IsInRole(SD.AdminRole) || (userId == receipt.UserId && receipt.Status == SD.Status_Pending)))
        {
            throw new ForbiddenException();
        }

        await _unitOfWork.Receipt.RemoveAsync(receipt);
        await _unitOfWork.SaveAsync();

        return Ok(_response);
    }
}