import { Link } from "react-router-dom"
import GoogleLoginButton from "./GoogleLoginButton";
import FacebookLoginButton from "./FacebookLoginButton";

function AuthLayout ({ crumb, children }) {
  return (
    <div className="login-page d-flex align-items-center justify-content-center min-vh-100">
      <div className="row shadow-lg rounded-4 p-5 bg-white" style={{ maxWidth: '1000px', width: '100%' }}>
        
        <div className="col-lg-6 d-flex flex-column">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-3">
              <li className="breadcrumb-item">
                <Link to="/" className="text-primary-custom">
                 <i className="bi-house-fill me-1"></i>
                  Trang chủ
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {crumb}
              </li>
            </ol>
          </nav>

          <h3 className="mb-3 text-black-custom text-center">
            Chào mừng đến với BackToYou
          </h3>
          <p className="mb-4 text-secondary-custom text-center">
            Nền tảng cộng đồng chia sẻ thông tin cấp thiết
          </p>

          <div className="border rounded p-3 mb-4 text-center">
            {/* <img 
              src="your-image-link.png" 
              alt="Chia sẻ nỗi lo" 
              className="img-fluid mb-3" 
              style={{ maxHeight: '100px' }}
            /> */}
            <h5 className="text-black-custom mb-2">SAN SẺ NỖI LO</h5>
            <a href="https://backtoyou.io.vn" className="text-primary-custom fw-bold">Truy cập: www.backtoyou.io.vn</a>

            <ul className="list-unstyled text-start mt-3">
              <li>✔️ Đăng tin miễn phí</li>
              <li>✔️ Có &quot;Badge VIP&quot; thu hút sự chú ý</li>
              <li>✔️ Ưu tiên cao trong kết quả tìm kiếm</li>
              <li>✔️ Được hỗ trợ từ đội ngũ 24/7</li>
            </ul>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="d-flex justify-content-center gap-2 mb-3">
            {/* <button className="btn btn-danger flex-fill">
              <i className="bi bi-google me-1"></i> Đăng nhập bằng Google
            </button> */}
            <GoogleLoginButton/>
            {/* <button className="btn btn-primary flex-fill">
              <i className="bi bi-facebook me-1"></i> Đăng nhập bằng Facebook
            </button> */}

            <FacebookLoginButton/>
          </div>

       

          <div className="text-center my-2">
            <span>Hoặc</span>
          </div>

          {/* form */}
          {children}
         
        </div>

      </div>
    </div>
  )
}

export default AuthLayout
