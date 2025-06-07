using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace PaymentAPI.Controllers;

[Route("wallets")]
[ApiController]
public class WalletAPIController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserService _userService;
    private readonly IMapper _mapper;
    private ResponseDto _response;

    public WalletAPIController(IUnitOfWork unitOfWork, IMapper mapper, IUserService userService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _response = new ResponseDto();
        _userService = userService;
    }

    [HttpGet]
    [Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> Get([FromQuery] WalletQueryParameters queryParameters)
    {
        var query = WalletFeatures.Build(queryParameters);
        IEnumerable<Wallet> wallets = await _unitOfWork.Wallet.GetAllAsync(query);

        _response.Result = _mapper.Map<IEnumerable<WalletDto>>(wallets);

        int totalItems = await _unitOfWork.Wallet.CountAsync(query);
        _response.Pagination = new PaginationDto
        {
            TotalItems = totalItems,
            TotalItemsPerPage = queryParameters.PageSize,
            CurrentPage = queryParameters.PageNumber,
            TotalPages = (int)Math.Ceiling((double)totalItems / queryParameters.PageSize)
        };

        return Ok(_response);
    }


    //[HttpGet]
    //[Authorize(Roles = SD.AdminRole)]
    //public async Task<ActionResult<ResponseDto>> Get([FromQuery] WalletQueryParameters? queryParameters)
    //{
    //    List<UserDto> users = null;
    //    List<Guid> userIds = null;

    //    // Nếu có lọc theo email
    //    if (!string.IsNullOrWhiteSpace(queryParameters.UserEmail))
    //    {
    //        users = await _userService.SearchUsersByEmail(queryParameters.UserEmail);

    //        // Không tìm thấy user nào thì trả về danh sách rỗng
    //        if (users.Count == 0)
    //        {
    //            _response.Result = new List<WalletDto>();
    //            return Ok(_response);
    //        }

    //        userIds = users.Select(u => Guid.Parse(u.Id)).Distinct().ToList();
    //    }


    //    var query = WalletFeatures.Build(queryParameters);

    //    if (userIds != null)
    //    {
    //        query.Filters.Add(p => userIds.Contains(p.UserId));
    //    }


    //    var wallets = await _unitOfWork.Wallet.GetAllAsync(query);
    //    var walletDtos = _mapper.Map<List<WalletDto>>(wallets);


    //    // Lấy danh sách user theo UserId từ report nếu không lọc theo email
    //    if (userIds == null)
    //    {
    //        var userIdsFromWallets = wallets.Select(p => p.UserId.ToString()).Distinct().ToList();

    //        if (userIdsFromWallets.Count > 0)
    //        {
    //            try
    //            {
    //                users = await _userService.GetUsersByIds(userIdsFromWallets);
    //            }
    //            catch
    //            {
    //                users = new List<UserDto>();
    //            }
    //        }
    //    }

    //    // Gán thông tin user vào từng post
    //    if (users != null && users.Count > 0)
    //    {
    //        var userDict = users.ToDictionary(u => u.Id);

    //        foreach (var wallet in walletDtos)
    //        {
    //            if (userDict.TryGetValue(wallet.UserId.ToString(), out var user))
    //            {
    //                wallet.User = user;
    //            }
    //        }
    //    }

    //    int totalItems = await _unitOfWork.Wallet.CountAsync(query);

    //    _response.Result = walletDtos;
    //    _response.Pagination = new PaginationDto
    //    {
    //        TotalItems = totalItems,
    //        TotalItemsPerPage = queryParameters.PageSize,
    //        CurrentPage = queryParameters.PageNumber,
    //        TotalPages = (int)Math.Ceiling((double)totalItems / queryParameters.PageSize)
    //    };

    //    return Ok(_response);
    //}


    [HttpGet("balance")]
    [Authorize()]
    public async Task<ActionResult<ResponseDto>> GetBalance()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }

        var wallet = await _unitOfWork.Wallet.GetAsync(c => c.UserId == userId);

        _response.Result = wallet is null ? 0 : wallet.Balance;
        return Ok(_response);
    }

    [HttpGet("balance/{email}")]
    [Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> GetBalanceByEmail(string email)
    {

        var user = await _userService.GetUserByEmail(email);

        if (user != null)
        {
            var wallet = await _unitOfWork.Wallet.GetAsync(c => c.UserId == Guid.Parse(user.Id));
            _response.Result = new
            {
                User = user,
                Wallet = wallet,
            };
        }

        return Ok(_response);
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<ResponseDto>> GetById(Guid id)
    {
        var wallet = await _unitOfWork.Wallet.GetAsync(c => c.WalletId == id);
        if (wallet == null)
        {
            throw new WalletNotFoundException(id);
        }

        _response.Result = _mapper.Map<WalletDto>(wallet);
        return Ok(_response);
    }

    [HttpPost("get-by-user-ids")]
    [Authorize(Roles = SD.AdminRole)]
    public async Task<IActionResult> GetByIds([FromBody] IEnumerable<string> userIds)
    {
        if (userIds == null || !userIds.Any())
            throw new BadRequestException("List of user ids is empty.");

        var query = new QueryParameters<Wallet>();
        query.Filters.Add(w => userIds.Contains(w.UserId.ToString()));

        var wallets = await _unitOfWork.Wallet.GetAllAsync(query);


        var walletDtos = _mapper.Map<List<WalletDto>>(wallets);

        _response.Result = walletDtos;
        return Ok(_response);
    }

    [HttpPut("funds")]
    [Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> AdjustFunds([FromBody] WalletDto dto)
    {
        if (dto.Balance == 0)
            throw new BadRequestException("Amount must be non‑zero.");

        var wallet = await _unitOfWork.Wallet.GetAsync(w => w.UserId == dto.UserId);
        if (wallet == null)
        {
            // Tạo mới ví, đảm bảo không âm
            wallet = _mapper.Map<Wallet>(dto);
            wallet.Balance = Math.Max(0, dto.Balance);      // âm ⇒ 0
            await _unitOfWork.Wallet.AddAsync(wallet);
        }
        else
        {
            var newBalance = wallet.Balance + dto.Balance;  // dto.Amount có thể âm

            if (newBalance < 0)
                throw new BadRequestException("Insufficient balance.");

            wallet.Balance = newBalance;
            await _unitOfWork.Wallet.UpdateAsync(wallet);
        }

        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<WalletDto>(wallet);
        return Ok(_response);
    }


    [HttpPut("subtract-balance")]
    [Authorize]
    public async Task<ActionResult<ResponseDto>> SubtractBalance([FromBody] decimal amount)
    {
        if (amount <= 0)
            throw new BadRequestException("Amount must be greater than zero.");

        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }

        Wallet walletFromDb = await _unitOfWork.Wallet.GetAsync(c => c.UserId == userId);
        if (walletFromDb == null)
        {
            throw new BadRequestException("You haven't created a wallet yet.");
        }

        if (walletFromDb.Balance < amount)
            throw new BadRequestException("Insufficient balance.");

        walletFromDb.Balance -= amount;


        await _unitOfWork.Wallet.UpdateAsync(walletFromDb);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<WalletDto>(walletFromDb);

        return Ok(_response);
    }

    [HttpPut("refund")]
    [Authorize]
    public async Task<ActionResult<ResponseDto>> Refund([FromBody] RefundDto refundDto)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }

        bool isAdmin = User.IsInRole(SD.AdminRole);

        if (!isAdmin && userId != refundDto.UserId)
        {
            throw new ForbiddenException();
        }

        if (refundDto.Amount <= 0)
            throw new BadRequestException("Amount must be greater than zero.");

        Wallet walletFromDb = await _unitOfWork.Wallet.GetAsync(c => c.UserId == refundDto.UserId);
        if (walletFromDb == null)
        {
            throw new BadRequestException("You haven't created a wallet yet.");
        }

        walletFromDb.Balance += refundDto.Amount;

        await _unitOfWork.Wallet.UpdateAsync(walletFromDb);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<WalletDto>(walletFromDb);

        return Ok(_response);
    }

    [HttpDelete]
    [Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult> Delete(Guid id)
    {
        var wallet = await _unitOfWork.Wallet.GetAsync(c => c.WalletId == id);
        if (wallet == null)
        {
            throw new WalletNotFoundException(id);
        }

        await _unitOfWork.Wallet.RemoveAsync(wallet);
        await _unitOfWork.SaveAsync();

        return Ok(_response);
    }
}

