using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace PaymentAPI.Controllers;

[Route("wallets")]
[ApiController]
public class WalletAPIController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private ResponseDto _response;

    public WalletAPIController(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _response = new ResponseDto();
    }

    [HttpGet]
    //[Authorize(Roles = SD.AdminRole)]
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

    [HttpPut]
    [Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> Put([FromBody] WalletDto walletDto)
    {
        Wallet wallet;

        if (walletDto.WalletId == null)
        {
            wallet = await _unitOfWork.Wallet.GetAsync(c => c.UserId == walletDto.UserId);
            if (wallet == null)
            {
                wallet = _mapper.Map<Wallet>(walletDto);
                await _unitOfWork.Wallet.AddAsync(wallet);
            }
            else
            {
                _mapper.Map(walletDto, wallet);
                await _unitOfWork.Wallet.UpdateAsync(wallet);
            }
        }
        else
        {
            wallet = await _unitOfWork.Wallet.GetAsync(c => c.WalletId == walletDto.WalletId);
            if (wallet == null)
            {
                throw new WalletNotFoundException(walletDto.WalletId);
            }

            _mapper.Map(walletDto, wallet);
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
    [Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> Refund([FromBody] RefundDto refundDto)
    {
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

