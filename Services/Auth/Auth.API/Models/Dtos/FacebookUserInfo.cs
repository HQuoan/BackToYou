namespace Auth.API.Models.Dtos;

public class FacebookUserInfo
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public PictureData Picture { get; set; }
}

public class PictureData
{
    public Data Data { get; set; }
}

public class Data
{
    public int Height { get; set; }
    public bool Is_Silhouette { get; set; }
    public string Url { get; set; }
    public int Width { get; set; }
}
