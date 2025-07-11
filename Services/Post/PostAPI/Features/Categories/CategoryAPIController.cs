﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PostAPI.Features.Categories.Queries;

namespace PostAPI.Features.Categories;
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
    public async Task<ActionResult<ResponseDto>> Post([FromBody] CategoryCreateDto categoryDto)
    {
        Category category = _mapper.Map<Category>(categoryDto);

        // Generate slug
        category.Slug = SlugGenerator.GenerateSlug(category.Name);

        await _unitOfWork.Category.AddAsync(category);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<CategoryDto>(category);

        return CreatedAtAction(nameof(GetById), new { id = category.CategoryId }, _response);
    }

    [HttpPut]
    //[Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> Put([FromBody] CategoryUpdateDto categoryDto)
    {

        Category cateFromDb = await _unitOfWork.Category.GetAsync(c => c.CategoryId == categoryDto.CategoryId);
        if (cateFromDb == null)
        {
            throw new CategoryNotFoundException(categoryDto.CategoryId);
        }

        _mapper.Map(categoryDto, cateFromDb);

        cateFromDb.Slug = SlugGenerator.GenerateSlug(categoryDto.Name);

        await _unitOfWork.Category.UpdateAsync(cateFromDb);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<CategoryDto>(cateFromDb);

        return Ok(_response);
    }

    [HttpDelete]
    [Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult> Delete(Guid id)
    {
        var category = await _unitOfWork.Category.GetAsync(c => c.CategoryId == id);
        if (category == null)
        {
            throw new CategoryNotFoundException(id);
        }

        await _unitOfWork.Category.RemoveAsync(category);
        await _unitOfWork.SaveAsync();

        return Ok(_response);
    }
}
