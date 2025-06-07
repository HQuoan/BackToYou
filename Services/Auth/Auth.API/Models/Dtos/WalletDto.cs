namespace Auth.API.Models.Dtos;

public class WalletDto
{
    public Guid? WalletId { get; set; }
    public Guid UserId { get; set; }
    public UserDto? User { get; set; }
    public decimal Balance { get; set; }
}
