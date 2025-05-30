using AutoMapper;

namespace NotificationAPI;

public class MappingConfig
{
    public static MapperConfiguration RegisterMaps()
    {
        var mappingConfig = new MapperConfiguration(config =>
        {
            config.CreateMap<Notification, NotificationDto>().ReverseMap();

        });

        return mappingConfig;
    }
}
