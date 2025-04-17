namespace PostAPI.Features.Posts.Dtos;

public class RefundDto
{
    public Guid UserId { get; set; }
    public decimal Amount { get; set; }
}
