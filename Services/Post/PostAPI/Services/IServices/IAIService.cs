using Microsoft.AspNetCore.Mvc;
using PostAPI.Features.PostImages.Dtos;

namespace PostAPI.Services.IServices;
public interface IAIService
{
    Task<SearchResponseDto> Compare([FromForm] AiSearchForm form);
    Task<string> DeleteEmbedding(Guid postId);
    Task<string> Embedding(List<PostImageInput> data);
}