using PostAPI.Features.Categories;
using PostAPI.Features.Categories.Dtos;
using PostAPI.Features.Posts;
using PostAPI.Features.Posts.Dtos;

namespace PostAPI;

public class MappingConfig
{
    public static MapperConfiguration RegisterMaps()
    {
        var mappingConfig = new MapperConfiguration(config =>
        {
            config.CreateMap<Category, CategoryDto>().ReverseMap();
            config.CreateMap<Category, CategoryCreateDto>().ReverseMap();
            config.CreateMap<Category, CategoryUpdateDto>().ReverseMap();

            config.CreateMap<Post, PostDto>().ReverseMap();
            config.CreateMap<Post, PostCreateDto>().ReverseMap();

            config.CreateMap<PostImage, PostImageDto>().ReverseMap();
            config.CreateMap<PostImage, PostImageCreateDto>().ReverseMap();

            config.CreateMap<Comment, CommentDto>().ReverseMap();


        });

        return mappingConfig;
    }
}
