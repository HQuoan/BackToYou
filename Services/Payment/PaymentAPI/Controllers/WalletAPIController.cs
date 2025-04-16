using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        IEnumerable<Wallet> comments = await _unitOfWork.Wallet.GetAllAsync(query);

        _response.Result = _mapper.Map<IEnumerable<WalletDto>>(comments);

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

    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<ResponseDto>> GetById(Guid id)
    {
        var comment = await _unitOfWork.Wallet.GetAsync(c => c.WalletId == id);
        if (comment == null)
        {
            throw new WalletNotFoundException(id);
        }

        _response.Result = _mapper.Map<WalletDto>(comment);
        return Ok(_response);
    }

    [HttpPut]
    [Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> Put([FromBody] WalletDto commentDto)
    {
        Wallet cateFromDb = await _unitOfWork.Wallet.GetAsync(c => c.WalletId == commentDto.WalletId);
        if (cateFromDb == null)
        {
            throw new WalletNotFoundException(commentDto.WalletId);
        }

        _mapper.Map(commentDto, cateFromDb);

        await _unitOfWork.Wallet.UpdateAsync(cateFromDb);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<WalletDto>(cateFromDb);

        return Ok(_response);
    }

    [HttpDelete]
    [Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult> Delete(Guid id)
    {
        var comment = await _unitOfWork.Wallet.GetAsync(c => c.WalletId == id);
        if (comment == null)
        {
            throw new WalletNotFoundException(id);
        }

        await _unitOfWork.Wallet.RemoveAsync(comment);
        await _unitOfWork.SaveAsync();

        return Ok(_response);
    }
}

