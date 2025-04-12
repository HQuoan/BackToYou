using Microsoft.AspNetCore.Mvc;

namespace Post.API.Controllers;
[Route("posts")]
[ApiController]
public class PostAPIController : ControllerBase
{
    private readonly DbContext _dbContext;
    public PostAPIController(DbContext dbContext)
    {
        _dbContext = dbContext;
    }

    //[HttpPost]
    //public async Task<IActionResult> Post()
}
