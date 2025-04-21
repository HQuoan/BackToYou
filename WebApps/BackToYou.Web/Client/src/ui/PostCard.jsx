function PostCard() {
  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow-sm h-100">
        <img src="https://via.placeholder.com/300x150" className="card-img-top" alt="item" />
        <div className="card-body">
          <span className="badge bg-warning text-dark mb-2">Tin ưu tiên</span>
          <h6 className="card-title fw-bold">Giấy tờ xe máy CHÂU NGỌC HÀ rơi ở TPHCM</h6>
          <p className="card-text text-muted mb-1"><i className="bi bi-geo-alt"></i> Hồ Chí Minh / Quận 8</p>
          <p className="text-success mb-0"><i className="bi bi-clock"></i> 48 ngày trước</p>
        </div>
      </div>
    </div>
  )
}

export default PostCard
