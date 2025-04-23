import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./HeroSection.css"; // Import custom CSS

// const carouselItems = [
//   {
//     image: "images/profile/smiling-business-woman-with-folded-hands-against-white-wall-toothy-smile-crossed-arms.jpg",
//     name: "Thu Hằng",
//     verified: true,
//     badges: ["Nhặt được", "Balo", "Công viên"],
//     social: ["bi-facebook", "bi-messenger"]
//   },
//   {
//     image: "images/profile/handsome-asian-man-listening-music-through-headphones.jpg",
//     name: "Minh Nhật",
//     verified: true,
//     badges: ["Báo mất", "Ví tiền", "Quận 1"],
//     social: ["bi-twitter", "bi-facebook", "bi-pinterest"]
//   },
//   {
//     image: "images/profile/cute-smiling-woman-outdoor-portrait.jpg",
//     name: "Ngọc Trân",
//     verified: false,
//     badges: ["Báo mất", "Thú cưng", "Mèo mun"],
//     social: ["bi-facebook", "bi-twitter", "bi-pinterest"]
//   },
//   {
//     image: "images/profile/man-portrait.jpg",
//     name: "Quốc Anh",
//     verified: false,
//     badges: ["Nhặt được", "CMND", "Gò Vấp"],
//     social: ["bi-instagram", "bi-youtube"]
//   },
//   {
//     image: "images/profile/woman-posing-black-dress-medium-shot.jpg",
//     name: "Lan Phương",
//     verified: true,
//     badges: ["Báo mất", "Điện thoại", "Chợ Tân Bình"],
//     social: ["bi-instagram", "bi-youtube"]
//   },
//   {
//     image: "images/profile/smart-attractive-asian-glasses-male-standing-smile-with-freshness-joyful-casual-blue-shirt-portrait-white-background.jpg",
//     name: "Trọng Nhân",
//     verified: false,
//     badges: ["Nhặt được", "Giấy tờ", "Bến xe Miền Đông"],
//     social: ["bi-linkedin", "bi-whatsapp"]
//   }
// ];


// Swiper configuration to match Owl Carousel behavior
const swiperOptions = {
  slidesPerView: 2,
  centeredSlides: true,
  loop: true,
  spaceBetween: 30,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  navigation: true,
  breakpoints: {
    767: {
      slidesPerView: 3,
    },
    1200: {
      slidesPerView: 4,
    },
  },
  // modules: [ Navigation],
  modules: [Autoplay, Navigation],
};

const handleSwiperHover = (swiper) => {
  const swiperEl = swiper.el;

  swiperEl.addEventListener("mouseenter", () => {
    if (swiper.autoplay && swiper.autoplay.stop) {
      swiper.autoplay.stop();
    }
  });

  swiperEl.addEventListener("mouseleave", () => {
    if (swiper.autoplay && swiper.autoplay.start) {
      swiper.autoplay.start();
    }
  });
};

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-12">
            <div className="text-center mb-5 pb-2">
              <h1 className="text-white">Welcome to Back To You</h1>
              <p className="text-white">
                Lost something? Let’s bring it back to you.
              </p>
              <a href="#section_2" className="btn custom-btn smoothscroll mt-3">
                Start searching
              </a>
            </div>

            <Swiper
              className="owl-carousel owl-theme"
              {...swiperOptions}
              onSwiper={handleSwiperHover}
            >
              {carouselItems.map((item, index) => (
                <SwiperSlide
                  className="owl-carousel-info-wrap item"
                  key={index}
                >
                  <img
                    src={item.image}
                    className="owl-carousel-image img-fluid"
                    alt={item.name}
                  />
                  <div className="owl-carousel-info">
                    <h4 className="mb-2">
                      {item.name}
                      {item.verified && (
                        <img
                          src="images/verified.png"
                          className="owl-carousel-verified-image img-fluid"
                          alt="verified"
                        />
                      )}
                    </h4>
                    {item.badges.map((badge, idx) => (
                      <span className="badge" key={idx}>
                        {badge}
                      </span>
                    ))}
                  </div>
                  <div className="social-share">
                    <ul className="social-icon">
                      {item.social.map((icon, idx) => (
                        <li className="social-icon-item" key={idx}>
                          <a
                            href="#"
                            className={`social-icon-link ${icon}`}
                          ></a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
