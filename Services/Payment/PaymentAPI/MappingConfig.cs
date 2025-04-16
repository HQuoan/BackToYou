namespace PaymentAPI;
public class MappingConfig
{
    public static MapperConfiguration RegisterMaps()
    {
        var mappingConfig = new MapperConfiguration(config =>
        {
            config.CreateMap<Receipt, ReceiptDto>().ReverseMap();
            config.CreateMap<Receipt, ReceiptCreateDto>().ReverseMap();

            config.CreateMap<Wallet, WalletDto>().ReverseMap();
        });

        return mappingConfig;
    }
}
