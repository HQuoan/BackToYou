using Microsoft.AspNetCore.Mvc;
using PostAPI.Features.PostSettings.Dtos;
using PostAPI.Features.PostSettings.Queries;

namespace PostSettingAPI.Features.PostSettings;
[Route("post-settings")]
[ApiController]
//[Authorize(Roles = SD.AdminRole)]
public class PostSettingAPIController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private ResponseDto _response;

    public PostSettingAPIController(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _response = new ResponseDto();
    }

    [HttpGet]
    public async Task<ActionResult<ResponseDto>> Get([FromQuery] PostSettingQueryParameters queryParameters)
    {
        var query = PostSettingFeatures.Build(queryParameters);
        IEnumerable<PostSetting> postSettings = await _unitOfWork.PostSetting.GetAllAsync(query);

        _response.Result = _mapper.Map<IEnumerable<PostSettingDto>>(postSettings);

        int totalItems = await _unitOfWork.PostSetting.CountAsync(query);
        _response.Pagination = new PaginationDto
        {
            TotalItems = totalItems,
            TotalItemsPerPage = queryParameters.PageSize,
            CurrentPage = queryParameters.PageNumber,
            TotalPages = (int)Math.Ceiling((double)totalItems / queryParameters.PageSize)
        };

        return Ok(_response);
    }

    [HttpGet("by-id/{id}")]
    public async Task<ActionResult<ResponseDto>> GetById(Guid id)
    {
        var postSetting = await _unitOfWork.PostSetting.GetAsync(c => c.PostSettingId == id);
        if (postSetting == null)
        {
            throw new PostSettingNotFoundException(id);
        }

        _response.Result = _mapper.Map<PostSettingDto>(postSetting);
        return Ok(_response);
    }

    [HttpGet("by-name/{name}")]
    public async Task<ActionResult<ResponseDto>> GetValue(string name)
    {
        var postSetting = await _unitOfWork.PostSetting.GetAsync(c => c.Name == name);
        if (postSetting == null)
        {
            throw new PostSettingNotFoundException(name);
        }

        _response.Result = _mapper.Map<PostSettingDto>(postSetting);
        return Ok(_response);
    }

    [HttpPost]
    //[Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> PostSetting([FromBody] PostSettingCreateDto postSettingDto)
    {
        PostSetting postSetting = _mapper.Map<PostSetting>(postSettingDto);


        await _unitOfWork.PostSetting.AddAsync(postSetting);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<PostSettingDto>(postSetting);

        return CreatedAtAction(nameof(GetById), new { id = postSetting.PostSettingId }, _response);
    }

    [HttpPut]
    //[Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> Put([FromBody] PostSettingUpdateDto postSettingDto)
    {
        PostSetting postSettingFromDb = await _unitOfWork.PostSetting.GetAsync(c => c.PostSettingId == postSettingDto.PostSettingId);
        if (postSettingFromDb == null)
        {
            throw new PostSettingNotFoundException(postSettingDto.PostSettingId);
        }

        if (postSettingFromDb.Name == nameof(SD.PostLabel_Priority_Price) && decimal.Parse(postSettingDto.Value) < 10000)
        {
            throw new BadRequestException($"{nameof(SD.PostLabel_Priority_Price)} must be greater than or equal to 10000");
        }

        if (postSettingFromDb.Name == nameof(SD.Priority_Days) && int.Parse(postSettingDto.Value) < 3)
        {
            throw new BadRequestException($"{nameof(SD.Priority_Days)} must be greater than or equal to 3");
        }

        _mapper.Map(postSettingDto, postSettingFromDb);

        await _unitOfWork.PostSetting.UpdateAsync(postSettingFromDb);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<PostSettingDto>(postSettingFromDb);

        return Ok(_response);
    }

    [HttpDelete]
    //[Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult> Delete(Guid id)
    {
        var postSetting = await _unitOfWork.PostSetting.GetAsync(c => c.PostSettingId == id);
        if (postSetting == null)
        {
            throw new PostSettingNotFoundException(id);
        }

        await _unitOfWork.PostSetting.RemoveAsync(postSetting);
        await _unitOfWork.SaveAsync();

        return Ok(_response);
    }
}
