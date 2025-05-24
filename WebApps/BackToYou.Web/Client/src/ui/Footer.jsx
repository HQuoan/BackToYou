import { useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "../features/authentication/useUser";
import { useCreateReport } from "../features/reports/useCreateReport";
import { REPORT_TITLES } from "../utils/constants";

function Footer() {
  const [description, setDescription] = useState("");
  const { isCreating, createReport } = useCreateReport();
  const { isAuthenticated } = useUser();

  function handleSubmit(e) {
    e.preventDefault(); // Ngăn reload trang

    if (!description.trim()) {
      toast.error("Nội dung không được để trống!");
      return;
    }

    if (isAuthenticated) {
      createReport(
        { description, title: REPORT_TITLES.FEEDBACK },
        {
          onSuccess: () => {
            setDescription("");
          },
          onError: () => {
            toast.error("Có lỗi xảy ra khi gửi góp ý.");
          },
        }
      );
    } else {
      toast.error("Vui lòng đăng nhập để dùng chức năng này!");
    }
  }

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row">
          {/* Góp ý */}
          <div className="col-lg-6 col-12 mb-5 mb-lg-0">
            <div className="subscribe-form-wrap">
              <h6>Đóng góp ý kiến.</h6>
              <form
                className="custom-form subscribe-form"
                role="form"
                onSubmit={handleSubmit}
              >
                <textarea
                  name="description"
                  id="subscribe-email"
                  className="form-control"
                  placeholder="Nội dung"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <div className="col-lg-12 col-12">
                  <button
                    type="submit"
                    className="form-control"
                    id="submit"
                    disabled={isCreating}
                  >
                    {isCreating ? "Đang gửi..." : "Góp ý"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6 col-12 mb-4 mb-md-0 mb-lg-0">
            <h6 className="site-footer-title mb-3">Contact</h6>
            <p className="mb-2">
              <strong className="d-inline me-2">Phone:</strong> 0398 746 214
            </p>
            <p>
              <strong className="d-inline me-2">Email:</strong>
              <a href="#">huyvodtan@gmail.com</a>
            </p>
          </div>

          {/* Social */}
          <div className="col-lg-3 col-md-6 col-12">
            <h6 className="site-footer-title mb-3">Social</h6>
            <ul className="social-icon">
              <li className="social-icon-item">
                <a
                  href="https://www.facebook.com/quoan.huy.5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link bi-instagram"
                ></a>
              </li>
              <li className="social-icon-item">
                <a
                  href="https://www.facebook.com/quoan.huy.5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link bi-facebook"
                ></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
