using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PostAPI.Features.PostLabels.Dtos;
using PostAPI.Features.PostLabels.Queries;

namespace PostLabelAPI.Features.PostLabels;
[Route("post-labels")]
[ApiController]
public class PostLabelAPIController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private ResponseDto _response;

    public PostLabelAPIController(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _response = new ResponseDto();
    }

    [HttpGet]
    public async Task<ActionResult<ResponseDto>> Get([FromQuery] PostLabelQueryParameters queryParameters)
    {
        var query = PostLabelFeatures.Build(queryParameters);
        IEnumerable<PostLabel> postLabels = await _unitOfWork.PostLabel.GetAllAsync(query);

        _response.Result = _mapper.Map<IEnumerable<PostLabelDto>>(postLabels);

        int totalItems = await _unitOfWork.PostLabel.CountAsync(query);
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
        var postLabel = await _unitOfWork.PostLabel.GetAsync(c => c.PostLabelId == id);
        if (postLabel == null)
        {
            throw new PostLabelNotFoundException(id);
        }

        _response.Result = _mapper.Map<PostLabelDto>(postLabel);
        return Ok(_response);
    }

    [HttpPost]
    [Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> PostLabel([FromBody] PostLabelCreateDto postLabelDto)
    {
        PostLabel postLabel = _mapper.Map<PostLabel>(postLabelDto);


        await _unitOfWork.PostLabel.AddAsync(postLabel);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<PostLabelDto>(postLabel);

        return CreatedAtAction(nameof(GetById), new { id = postLabel.PostLabelId }, _response);
    }

    [HttpPut]
    [Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> Put([FromBody] PostLabelUpdateDto postLabelDto)
    {
        PostLabel postLabelFromDb = await _unitOfWork.PostLabel.GetAsync(c => c.PostLabelId == postLabelDto.PostLabelId);
        if (postLabelFromDb == null)
        {
            throw new PostLabelNotFoundException(postLabelDto.PostLabelId);
        }


        _mapper.Map(postLabelDto, postLabelFromDb);

        await _unitOfWork.PostLabel.UpdateAsync(postLabelFromDb);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<PostLabelDto>(postLabelFromDb);

        return Ok(_response);
    }

    [HttpDelete]
    [Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult> Delete(Guid id)
    {
        var postLabel = await _unitOfWork.PostLabel.GetAsync(c => c.PostLabelId == id);
        if (postLabel == null)
        {
            throw new PostLabelNotFoundException(id);
        }

        await _unitOfWork.PostLabel.RemoveAsync(postLabel);
        await _unitOfWork.SaveAsync();

        return Ok(_response);
    }
}
