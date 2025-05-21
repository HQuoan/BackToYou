namespace PostAPI.Features.Posts.Dtos;
public class PostUpdateDto : PostCreateDto
{
    public Guid PostId { get; set; }
   
}

public class PostUpdateDtoValidator : AbstractValidator<PostUpdateDto>
{
    public PostUpdateDtoValidator()
    {
        RuleFor(x => x.PostId).NotEmpty();
        Include(new PostCreateDtoValidator());
    }
}
