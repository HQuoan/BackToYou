import { Link } from "react-router-dom"

function RegisterForm() {
  return (
  <>
    <form className="p-4 border rounded bg-light">
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Nhập email của bạn</label>
        <input type="email" className="form-control" id="email" placeholder="email@gmail.com" />
      </div>

      <div className="mb-3">
        <label htmlFor="fullname" className="form-label">Họ và tên</label>
        <input type="fullname" className="form-control" id="fullname" placeholder="Võ Minh Huy" />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">Nhập mật khẩu</label>
        <input type="password" className="form-control" id="password" placeholder="******" />
      </div>

      <div className="mb-4">
        <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
        <input type="password" className="form-control" id="confirmPassword" placeholder="******" />
      </div>

      <div className="d-grid">
        <button type="submit" className="btn custom-btn">Đăng ký</button>
      </div>
    </form>

    <p className="text-center mt-3">
      Bạn đã có tài khoản?
      <Link to="/login" className="text-primary-custom ms-2">Đăng nhập</Link>
    </p>
  </>
  )
}

export default RegisterForm
