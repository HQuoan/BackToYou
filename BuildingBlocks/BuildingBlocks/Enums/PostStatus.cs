namespace BuildingBlocks.Enums;
public enum PostStatus
{
    Pending = 1,      // Chờ duyệt
    Processing = 2,   // Đang xử lý
    Approved = 3,     // Đã duyệt và sẽ hiển thị
    Rejected = 4      // Bị từ chối
}