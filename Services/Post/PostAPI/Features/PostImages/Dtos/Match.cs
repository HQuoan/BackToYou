using Newtonsoft.Json;

namespace PostAPI.Features.PostImages.Dtos;

public class Match
{
    [JsonProperty("post_image_id")] // Ánh xạ với post_image_id trong JSON
    public string PostImageId { get; set; }

    [JsonProperty("similarity_score")] // Ánh xạ với similarity_score trong JSON
    public float SimilarityScore { get; set; }

    [JsonProperty("post_id")] // Ánh xạ với post_id trong JSON
    public string PostId { get; set; }
}