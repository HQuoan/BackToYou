function NoData({ message = "Không có bài viết nào.", description = "Chúng tôi không tìm thấy kết quả nào cho tìm kiếm của bạn. Vui lòng thử lại với các tiêu chí khác." }) {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "600px" }}>
      <div className="text-center">
        <h4>{message}</h4>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default NoData;
