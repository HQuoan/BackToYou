using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PostAPI.Controllers;
[Route("categories")]
[ApiController]
public class CategoryAPIController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private ResponseDto _response;

    public CategoryAPIController(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _response = new ResponseDto();
    }

    [HttpGet]
    [Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> Get([FromQuery] CategoryQueryParameters queryParameters)
    {
        var query = CategoryFeatures.Build(queryParameters);
        IEnumerable<Category> categories = await _unitOfWork.Category.GetAllAsync(query);

        _response.Result = _mapper.Map<IEnumerable<CategoryDto>>(categories);

        int totalItems = await _unitOfWork.Category.CountAsync(query);
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
        var category = await _unitOfWork.Category.GetAsync(c => c.CategoryId == id);
        if (category == null)
        {
            throw new CategoryNotFoundException(id);
        }

        _response.Result = _mapper.Map<CategoryDto>(category);
        return Ok(_response);
    }

    [HttpGet]
    [Route("by-slug/{slug}")]
    public async Task<ActionResult<ResponseDto>> GetBySlug(string slug)
    {
        var category = await _unitOfWork.Category.GetAsync(c => c.Slug == slug);
        if (category == null)
        {
            throw new CategoryNotFoundException(slug);
        }

        _response.Result = _mapper.Map<CategoryDto>(category);
        return Ok(_response);
    }

    [HttpPost]
    //[Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> Post([FromBody] CategoryDto categoryDto)
    {
        Category category = _mapper.Map<Category>(categoryDto);

        category.CategoryId = Guid.NewGuid();
        // Generate slug
        category.Slug = SlugGenerator.GenerateSlug(category.Name);


        try
        {
            await _unitOfWork.Category.AddAsync(category);
            await _unitOfWork.SaveAsync();
        }
        catch (DbUpdateException ex)
        {
            if (Util.IsUniqueConstraintViolation(ex))
            {
                var duplicateField = Util.ExtractDuplicateField(ex);
                throw new DuplicateKeyException(duplicateField);
            }

            throw;
        }

        _response.Result = _mapper.Map<CategoryDto>(category);

        return CreatedAtAction(nameof(GetById), new { id = category.CategoryId }, _response);
    }

    [HttpPut]
    //[Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> Put([FromBody] CategoryDto categoryDto)
    {
        Category category = _mapper.Map<Category>(categoryDto);

        Category cateFromDb = await _unitOfWork.Category.GetAsync(c => c.CategoryId == categoryDto.CategoryId);
        if (cateFromDb == null)
        {
            throw new CategoryNotFoundException(categoryDto.CategoryId);
        }

        // Generate slug
        cateFromDb.Name = category.Name;
        cateFromDb.Slug = SlugGenerator.GenerateSlug(category.Name);

        try
        {
            await _unitOfWork.Category.UpdateAsync(cateFromDb);
            await _unitOfWork.SaveAsync();
        }
        catch (DbUpdateException ex)
        {
            if (Util.IsUniqueConstraintViolation(ex))
            {
                var duplicateField = Util.ExtractDuplicateField(ex);
                throw new DuplicateKeyException(duplicateField);
            }

            throw;
        }

        _response.Result = _mapper.Map<CategoryDto>(cateFromDb);

        return Ok(_response);
    }

    [HttpDelete]
    //[Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult> Delete(Guid id)
    {
        var category = await _unitOfWork.Category.GetAsync(c => c.CategoryId == id);
        if (category == null)
        {
            throw new NotFoundException($"Category with ID: {id} not found.");
        }

        await _unitOfWork.Category.RemoveAsync(category);
        await _unitOfWork.SaveAsync();

        return Ok(_response);
    }
}
