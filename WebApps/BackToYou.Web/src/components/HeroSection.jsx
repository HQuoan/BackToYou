import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './HeroSection.css'; // Import custom CSS

const carouselItems = [
  {
    image: 'images/profile/smiling-business-woman-with-folded-hands-against-white-wall-toothy-smile-crossed-arms.jpg',
    name: 'Candice',
    verified: true,
    badges: ['Storytelling', 'Business'],
    social: ['bi-twitter', 'bi-facebook'],
  },
  {
    image: 'images/profile/handsome-asian-man-listening-music-through-headphones.jpg',
    name: 'William',
    verified: true,
    badges: ['Creative', 'Design'],
    social: ['bi-twitter', 'bi-facebook', 'bi-pinterest'],
  },
  {
    image: 'images/profile/cute-smiling-woman-outdoor-portrait.jpg',
    name: 'Taylor',
    verified: false,
    badges: ['Modeling', 'Fashion'],
    social: ['bi-twitter', 'bi-facebook', 'bi-pinterest'],
  },
  {
    image: 'images/profile/man-portrait.jpg',
    name: 'Nick',
    verified: false,
    badges: ['Acting'],
    social: ['bi-instagram', 'bi-youtube'],
  },
  {
    image: 'images/profile/woman-posing-black-dress-medium-shot.jpg',
    name: 'Elsa',
    verified: true,
    badges: ['Influencer'],
    social: ['bi-instagram', 'bi-youtube'],
  },
  {
    image: 'images/profile/smart-attractive-asian-glasses-male-standing-smile-with-freshness-joyful-casual-blue-shirt-portrait-white-background.jpg',
    name: 'Chan',
    verified: false,
    badges: ['Education'],
    social: ['bi-linkedin', 'bi-whatsapp'],
  },
];

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

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-12">
            <div className="text-center mb-5 pb-2">
              <h1 className="text-white">Listen to Pod Talk</h1>
              <p className="text-white">Listen it everywhere. Explore your fav podcasts.</p>
              <a href="#section_2" className="btn custom-btn smoothscroll mt-3">
                Start listening
              </a>
            </div>

            <Swiper className="owl-carousel owl-theme" {...swiperOptions}>
              {carouselItems.map((item, index) => (
                <SwiperSlide className="owl-carousel-info-wrap item" key={index}>
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
                          <a href="#" className={`social-icon-link ${icon}`}></a>
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