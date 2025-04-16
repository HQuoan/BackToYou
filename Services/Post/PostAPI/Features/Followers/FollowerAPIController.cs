using FollowerAPI.Features.Followers.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PostAPI.Features.Followers.Dtos;
using PostAPI.Features.Followers.Queries;
using System.Security.Claims;

namespace PostAPI.Features.Followers;
[Route("followers")]    
[ApiController]
public class FollowerAPIController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private ResponseDto _response;

    public FollowerAPIController(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _response = new ResponseDto();
    }

    [HttpGet]
    //[Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> Get([FromQuery] FollowerQueryParameters queryParameters)
    {
        var query = FollowerFeatures.Build(queryParameters);
        IEnumerable<Follower> followers = await _unitOfWork.Follower.GetAllAsync(query);

        _response.Result = _mapper.Map<IEnumerable<FollowerDto>>(followers);

        int totalItems = await _unitOfWork.Follower.CountAsync(query);
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
        var follower = await _unitOfWork.Follower.GetAsync(c => c.FollowerId == id);
        if (follower == null)
        {
            throw new FollowerNotFoundException(id);
        }

        _response.Result = _mapper.Map<FollowerDto>(follower);
        return Ok(_response);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ResponseDto>> Post([FromBody] FollowerCreateDto followerDto)
    {
        Follower follower = _mapper.Map<Follower>(followerDto);

        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }
        follower.UserId = userId;


        await _unitOfWork.Follower.AddAsync(follower);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<FollowerDto>(follower);

        return CreatedAtAction(nameof(GetById), new { id = follower.FollowerId }, _response);
    }

    [HttpDelete]
    [Authorize]
    public async Task<ActionResult> Delete(Guid id)
    {
        var follower = await _unitOfWork.Follower.GetAsync(c => c.FollowerId == id);
        if (follower == null)
        {
            throw new FollowerNotFoundException(id);
        }

        bool isAdmin = User.IsInRole(SD.AdminRole);

        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }

        if (!isAdmin && userId != follower.UserId)
        {
            throw new ForbiddenException();
        }

        await _unitOfWork.Follower.RemoveAsync(follower);
        await _unitOfWork.SaveAsync();

        return Ok(_response);
    }
}
