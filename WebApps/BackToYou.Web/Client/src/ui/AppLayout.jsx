import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import ScrollToTop from "./ScrollToTop";
import ScrollToTopButton from "./ScrollToTopButton";
import { NotificationListener } from "../notification/NotificationListener";

function AppLayout() {
  NotificationListener;
  return (
    <>
      <ScrollToTop />
      <Header />
      <Outlet />
      <Footer />
      <ScrollToTopButton />
      <NotificationListener />
    </>
  );
}

export default AppLayout;
