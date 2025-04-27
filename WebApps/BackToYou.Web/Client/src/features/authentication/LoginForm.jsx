import { Link } from "react-router-dom"

function LoginForm() {
  return (
  <>
    <form className="p-4 border rounded bg-light">
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Nhập email của bạn</label>
        <input type="email" className="form-control" id="email" placeholder="email@gmail.com" />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="form-label">Nhập mật khẩu</label>
        <input type="password" className="form-control" id="password" placeholder="******" />
      </div>

      <div className="d-grid">
        <button type="submit" className="btn custom-btn">Đăng nhập</button>
      </div>
    </form>

    <p className="text-center mt-3">
      Bạn chưa có tài khoản? 
      <Link to="/register" className="text-primary-custom ms-2">Đăng ký</Link>
    </p>
  </>
  )
}

export default LoginForm
