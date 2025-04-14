using System.ComponentModel;

namespace PostAPI.Features.Posts.Dtos;
public class PostCreateDto
{
    public Guid UserId { get; set; }
    [DefaultValue("227f875a-22e0-4c73-4781-08dd7b3e0244")]
    public Guid CategoryId { get; set; }
    [DefaultValue("Tìm đồ")]
    public string Title { get; set; }
    [DefaultValue("Mất đồ")]
    public string Description { get; set; }
    public Location Location { get; set; }
    public PostType PostType { get; set; }
    public PostLabel PostLabel { get; set; }
    public ICollection<PostImageCreateDto>? PostImages { get; set; }
}
