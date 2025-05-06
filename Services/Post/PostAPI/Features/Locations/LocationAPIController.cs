using Microsoft.AspNetCore.Mvc;

namespace PostAPI.Features.Locations;
[Route("locations")]
[ApiController]
public class LocationAPIController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private ResponseDto _response;

    public LocationAPIController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _response = new ResponseDto();
    }

    [HttpGet("provinces")]
    public async Task<ActionResult<ResponseDto>> GetProvinces([FromQuery] string? name)
    {
        var query = new QueryParameters<Province>
        {
            PageSize = 0,
            OrderBy = q => q.OrderBy(p => p.Name)
        };


        if (name is not null)
        {
            query.Filters.Add(p => p.Name.Contains(name));
        }

        var data = await _unitOfWork.Province
            .GetAllAsync(
                query,
                p => new { p.Code, p.Name }
            );

        _response.Result = data;   

        return Ok(_response);
    }

    [HttpGet("districts")]
    public async Task<ActionResult<ResponseDto>> GetDistricts([FromQuery] string? provinceCode, [FromQuery] string? name)
    {
        var query = new QueryParameters<District>
        {
            PageSize = 0,
            OrderBy = q => q.OrderBy(p => p.Name)
        };

        if (provinceCode is not null)
        {
            query.Filters.Add(p => p.ProvinceCode == provinceCode);
        }

        if (name is not null)
        {
            query.Filters.Add(p => p.Name.Contains(name));
        }

        var data = await _unitOfWork.District
            .GetAllAsync(
                query,
                p => new { p.Code, p.Name }
            );

        _response.Result = data;

        return Ok(_response);
    }

    [HttpGet("wards")]
    public async Task<ActionResult<ResponseDto>> GetWards([FromQuery] string? districtCode, [FromQuery] string? name)
    {
        var query = new QueryParameters<Ward>
        {
            PageSize = 0,
            OrderBy = q => q.OrderBy(p => p.Name)
        };

        if (districtCode is not null)
        {
            query.Filters.Add(p => p.DistrictCode == districtCode);
        }

        if (name is not null)
        {
            query.Filters.Add(p => p.Name.Contains(name));
        }

        var data = await _unitOfWork.Ward
            .GetAllAsync(
                query,
                p => new { p.Code, p.Name }
            );

        _response.Result = data;

        return Ok(_response);
    }
}
