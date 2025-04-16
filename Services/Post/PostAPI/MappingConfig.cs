using PostAPI.Features.Categories.Dtos;
using PostAPI.Features.Comments.Dtos;
using PostAPI.Features.Followers.Dtos;
using PostAPI.Features.PostImages.Dtos;
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
            config.CreateMap<Post, PostUpdateDto>().ReverseMap();
            config.CreateMap<Post, PostUpdateLabelDto>().ReverseMap();

            config.CreateMap<PostImage, PostImageDto>().ReverseMap();

            config.CreateMap<Comment, CommentDto>().ReverseMap();
            config.CreateMap<Comment, CommentCreateDto>().ReverseMap();
            config.CreateMap<Comment, CommentUpdateDto>().ReverseMap();

            config.CreateMap<Follower, FollowerDto>().ReverseMap();
            config.CreateMap<Follower, FollowerCreateDto>().ReverseMap();

        });

        return mappingConfig;
    }
}
