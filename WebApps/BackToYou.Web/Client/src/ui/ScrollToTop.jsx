import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // window.scrollTo(0, 0); 
    window.scrollTo({ top: 0, behavior: "smooth" });// Scroll lên đầu trang mỗi lần đổi route
  }, [pathname]);

  return null; // Component này không render gì
};

export default ScrollToTop;
