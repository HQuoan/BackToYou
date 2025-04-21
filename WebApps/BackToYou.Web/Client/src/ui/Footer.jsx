function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-12 mb-5 mb-lg-0">
            <div className="subscribe-form-wrap">
              <h6>Subscribe. Every weekly.</h6>
              <form className="custom-form subscribe-form" role="form">
                <input
                  type="email"
                  name="subscribe-email"
                  id="subscribe-email"
                  pattern="[^ @]*@[^ @]*"
                  className="form-control"
                  placeholder="Email Address"
                  required
                />
                <div className="col-lg-12 col-12">
                  <button type="submit" className="form-control" id="submit">
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-12 mb-4 mb-md-0 mb-lg-0">
            <h6 className="site-footer-title mb-3">Contact</h6>
            <p className="mb-2">
              <strong className="d-inline me-2">Phone:</strong> 010-020-0340
            </p>
            <p>
              <strong className="d-inline me-2">Email:</strong>
              <a href="#">inquiry@pod.co</a>
            </p>
          </div>
          <div className="col-lg-3 col-md-6 col-12">
            <h6 className="site-footer-title mb-3">Download Mobile</h6>
            <div className="site-footer-thumb mb-4 pb-2">
              <div className="d-flex flex-wrap">
                <a href="#">
                  <img
                    src="images/app-store.png"
                    className="me-3 mb-2 mb-lg-0 img-fluid"
                    alt=""
                  ></img>
                </a>

                <a href="#">
                  <img
                    src="images/play-store.png"
                    className="img-fluid"
                    alt=""
                  ></img>
                </a>
              </div>
            </div>
            <h6 className="site-footer-title mb-3">Social</h6>
            <ul className="social-icon">
              <li className="social-icon-item">
                <a href="#" className="social-icon-link bi-instagram"></a>
              </li>
              <li className="social-icon-item">
                <a href="#" className="social-icon-link bi-twitter"></a>
              </li>
              <li className="social-icon-item">
                <a href="#" className="social-icon-link bi-whatsapp"></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
