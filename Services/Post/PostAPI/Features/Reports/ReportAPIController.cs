using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PostAPI.Features.Posts.Dtos;
using PostAPI.Features.Reports.Dtos;
using PostAPI.Features.Reports.Queries;
using System.Security.Claims;

namespace PostAPI.Features.Reports;
[Route("reports")]
[ApiController]
[Authorize]
public class ReportAPIController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserService _userService;
    private readonly IMapper _mapper;
    private ResponseDto _response;
    public ReportAPIController(IUnitOfWork unitOfWork, IMapper mapper, IUserService userService)
    {
        _unitOfWork = unitOfWork;
        _response = new();
        _mapper = mapper;
        _userService = userService;
    }

    //[HttpGet]
    //[Authorize(Roles = SD.AdminRole)]
    //public async Task<ActionResult<ResponseDto>> Get([FromQuery] ReportQueryParameters? queryParameters)
    //{
    //    UserDto user = null;
    //    if (!string.IsNullOrWhiteSpace(queryParameters.UserEmail))
    //    {
    //        user = await _userService.GetUserByEmail(queryParameters.UserEmail);
    //        if (user == null)
    //        {
    //            _response.Result = new List<ReportDto>();
    //            return Ok(_response);
    //        }

    //        queryParameters.UserId = Guid.Parse(user.Id);
    //    }


    //    var query = ReportFeatures.Build(queryParameters);

    //    var reports = await _unitOfWork.Report.GetAllAsync(query);
    //    var reportDtos = _mapper.Map<List<ReportDto>>(reports);

    //    if (user != null)
    //    {
    //        reportDtos.ForEach(p => p.User = user);
    //    }
    //    else
    //    {
    //        var userIds = reports.Select(p => p.UserId.ToString()).Distinct().ToList();

    //        List<UserDto> userDtos = new();
    //        if (userIds.Count > 0)
    //        {
    //            try
    //            {
    //                userDtos = await _userService.GetUsersByIds(userIds);
    //            }
    //            catch
    //            {
    //                // Bỏ qua lỗi → userDtos = empty
    //            }
    //        }

    //        if (userDtos != null && userDtos.Count > 0)
    //        {
    //            foreach (var report in reportDtos)
    //            {
    //                report.User = userDtos.FirstOrDefault(u => u.Id == report.UserId.ToString());
    //            }
    //        }
    //    }


    //    int totalItems = await _unitOfWork.Report.CountAsync(query);

    //    _response.Result = reportDtos;
    //    _response.Pagination = new PaginationDto
    //    {
    //        TotalItems = totalItems,
    //        TotalItemsPerPage = queryParameters.PageSize,
    //        CurrentPage = queryParameters.PageNumber,
    //        TotalPages = (int)Math.Ceiling((double)totalItems / queryParameters.PageSize)
    //    };

    //    return Ok(_response);
    //}

    [HttpGet]
    [Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> Get([FromQuery] ReportQueryParameters? queryParameters)
    {
        List<UserDto> users = null;
        List<Guid> userIds = null;

        // Nếu có lọc theo email
        if (!string.IsNullOrWhiteSpace(queryParameters.UserEmail))
        {
            users = await _userService.SearchUsersByEmail(queryParameters.UserEmail);

            // Không tìm thấy user nào thì trả về danh sách rỗng
            if (users.Count == 0)
            {
                _response.Result = new List<PostDto>();
                return Ok(_response);
            }

            userIds = users.Select(u => Guid.Parse(u.Id)).Distinct().ToList();
        }


        var query = ReportFeatures.Build(queryParameters);

        if (userIds != null)
        {
            query.Filters.Add(p => userIds.Contains(p.UserId));
        }


        var reports = await _unitOfWork.Report.GetAllAsync(query);
        var reportDtos = _mapper.Map<List<ReportDto>>(reports);


        // Lấy danh sách user theo UserId từ report nếu không lọc theo email
        if (userIds == null)
        {
            var userIdsFromReports = reports.Select(p => p.UserId.ToString()).Distinct().ToList();

            if (userIdsFromReports.Count > 0)
            {
                try
                {
                    users = await _userService.GetUsersByIds(userIdsFromReports);
                }
                catch
                {
                    users = new List<UserDto>();
                }
            }
        }

        // Gán thông tin user vào từng post
        if (users != null && users.Count > 0)
        {
            var userDict = users.ToDictionary(u => u.Id);

            foreach (var report in reportDtos)
            {
                if (userDict.TryGetValue(report.UserId.ToString(), out var user))
                {
                    report.User = user;
                }
            }
        }

        int totalItems = await _unitOfWork.Report.CountAsync(query);

        _response.Result = reportDtos;
        _response.Pagination = new PaginationDto
        {
            TotalItems = totalItems,
            TotalItemsPerPage = queryParameters.PageSize,
            CurrentPage = queryParameters.PageNumber,
            TotalPages = (int)Math.Ceiling((double)totalItems / queryParameters.PageSize)
        };

        return Ok(_response);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> GetById(Guid id)
    {

        var report = await _unitOfWork.Report.GetAsync(r => r.ReportId == id);


        if (report == null)
            throw new ReportNotFoundException(id);

        List<UserDto> userDtos = new();
        try
        {
            userDtos = await _userService.GetUsersByIds(new[] { report.UserId.ToString() });
        }
        catch
        {
            // Bỏ qua lỗi → userDtos = empty
        }

        // --- Lấy thông tin tác giả ---
        var author = userDtos.FirstOrDefault();

        var reportDto = _mapper.Map<ReportDto>(report);
        reportDto.User = author;

        _response.Result = reportDto;
        return Ok(_response);
    }


    [HttpPost]
    public async Task<ActionResult<ResponseDto>> Post([FromBody] ReportCreateDto reportDto)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new BadRequestException("Invalid or missing user ID claim.");
        }

        var report = _mapper.Map<Report>(reportDto);
        report.UserId = userId;
        report.Status = PostStatus.Pending;


        await _unitOfWork.Report.AddAsync(report);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<ReportDto>(report);

        return CreatedAtAction(null, _response);
    }

    [HttpPut]
    [Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult<ResponseDto>> Put([FromBody] ReportUpdateStatus reportDto)
    {
        var reportFromDb = await _unitOfWork.Report.GetAsync(r => r.ReportId == reportDto.ReportId);

        if(reportFromDb == null)
        {
            throw new ReportNotFoundException(reportDto.ReportId);
        }

        reportFromDb.Status = reportDto.Status;

        if (reportDto.RejectionReason != null)
            reportFromDb.RejectionReason = reportDto.RejectionReason;


        await _unitOfWork.Report.UpdateAsync(reportFromDb);
        await _unitOfWork.SaveAsync();

        _response.Result = _mapper.Map<ReportDto>(reportFromDb);

        return Ok(_response);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = SD.AdminRole)]
    public async Task<ActionResult> Delete(Guid id)
    {
        var report = await _unitOfWork.Report.GetAsync(c => c.ReportId == id);
        if (report == null)
        {
            throw new ReportNotFoundException(id);
        }

        await _unitOfWork.Report.RemoveAsync(report);
        await _unitOfWork.SaveAsync();

        return Ok(_response);
    }
}
