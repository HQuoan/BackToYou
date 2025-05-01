function SidebarNav() {
  return (
    <div className="sidebar p-4">
      <ul className="nav flex-column">
        <li className="nav-item">
          <a className="nav-link" id="nav-general"  href="#general">
            Tổng quan
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" id="nav-location"  href="#location">
            Địa chỉ
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" id="nav-photos" href="#photos">
            Ảnh
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" id="nav-contact" href="#contact">
            Thông tin liên hệ để lấy lại
          </a>
        </li>
      </ul>
    </div>
  );
}

export default SidebarNav;
