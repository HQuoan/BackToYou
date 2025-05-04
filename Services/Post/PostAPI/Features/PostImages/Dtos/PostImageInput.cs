using Newtonsoft.Json;

namespace PostAPI.Features.PostImages.Dtos;

public class PostImageInput
{
    [JsonProperty("post_id")]
    public string PostId { get; set; }

    [JsonProperty("post_image_id")]
    public string PostImageId { get; set; }

    [JsonProperty("image_url")]
    public string ImageUrl { get; set; }
}
