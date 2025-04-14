using AutoMapper;

namespace PostAPI;

public class MappingConfig
{
    public static MapperConfiguration RegisterMaps()
    {
        var mappingConfig = new MapperConfiguration(config =>
        {
            config.CreateMap<Category, CategoryDto>().ReverseMap();
        });

         return mappingConfig;
    }
}
