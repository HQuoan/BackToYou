function SideBar() {
  return (
    <div className="sidebar-block d-flex bg-light">
      <div className="">
        <ul className="list-unstyled mb-3">
          <li className="mb-2">
            <i className="bi bi-house-door me-2"></i> Đăng tin
          </li>
          <li className="mb-2">
            <i className="bi bi-emoji-smile me-2"></i> Mất đồ
          </li>
          <li className="mb-2">
            <i className="bi bi-gift me-2"></i> Nhặt được
          </li>
          <li className="mb-2">
            <i className="bi bi-people-fill me-2"></i> Tìm người thân
          </li>
          <li className="mb-2">
            <i className="bi bi-paw me-2"></i> Tìm thú cưng
          </li>
          <li className="mb-2">
            <i className="bi bi-bicycle me-2"></i> Tìm xe cộ
          </li>
          <li className="mb-2">
            <i className="bi bi-card-list me-2"></i> Danh sách lừa đảo
          </li>
        </ul>

        <hr />

        <ul className="list-unstyled">
          <li className="mb-2">
            <i className="bi bi-lightbulb me-2"></i> Mẹo tìm kiếm
          </li>
          <li className="mb-2">
            <i className="bi bi-person me-2"></i> Giới thiệu
          </li>
          <li className="mb-2">
            <i className="bi bi-shop me-2"></i> Cửa hàng
          </li>
          <li className="mb-2">
            <i className="bi bi-shield-lock me-2"></i> Chính sách bảo mật
          </li>
          <li className="mb-2">
            <i className="bi bi-file-earmark-text me-2"></i> Điều khoản sử dụng
          </li>
          <li className="mb-2">
            <i className="bi bi-currency-dollar me-2"></i> Ủng hộ dự án
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
