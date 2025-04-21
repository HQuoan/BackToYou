import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from './../components/Navbar';
import HeroSection from "../components/HeroSection";
import Header from './Header';

function AppLayout() {
  return (
    <>
      <Header  />
      <Outlet />
      <Footer />
      {/* <Header/> */}
      {/* <HeroSection/> */}

      {/* <Header />
      <main className="hero-section">
        <section className="hero-section">
          <div className="container">
            <Outlet />
          </div>
        </section>
      </main>
      <Footer /> */}
    </>
  );
}

export default AppLayout;

{
  /* <section className="hero-section">
<div className="container">
</div>
</section> */
}
