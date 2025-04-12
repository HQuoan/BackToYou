using Microsoft.AspNetCore.Mvc;
using Post.API.Models;

namespace Post.API.Controllers;
[Route("posts")]
[ApiController]
public class CategoryAPIController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    public CategoryAPIController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost]
    public async Task<IActionResult> Post(Category category)
    {
        await _dbContext.Categories.AddAsync(category);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(Post), new { id = category.CategoryId}, category);
    }
}
