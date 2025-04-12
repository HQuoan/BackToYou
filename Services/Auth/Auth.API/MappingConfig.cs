using AutoMapper;

namespace Auth.API;

public class MappingConfig
{
    public static MapperConfiguration RegisterMaps()
    {
        var mappingConfig = new MapperConfiguration(config =>
        {
            config.CreateMap<ApplicationUser, UserDto>();

        });

        return mappingConfig;
    }
}
