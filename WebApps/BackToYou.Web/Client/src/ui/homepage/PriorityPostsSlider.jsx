import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./PriorityPostsSlider.css";
import PostTypeBadge from "../PostTypeBadge ";
import PriorityLabel from "../PriorityLabel";
import { Link } from "react-router-dom";
import { usePosts } from "../../features/posts/usePosts";
import { POST_LABEL_PRIORITY } from "./../../utils/constants";
import Spinner from "../Spinner";
import LinkShareFb from './../LinkShareFb';
import LinkShareFbIcon from "../LinkShareFbIcon";

// const social = [
//   // "bi-twitter",
//   "bi-person-fill",
//   "bi-facebook",
//   "bi-whatsapp",
//   // "bi-pinterest",
//   // "bi-messenger",
//   // "bi-instagram",
//   // "bi-youtube",
//   // "bi-linkedin",
// ];

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
  // modules: [Navigation],
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

// Duplicate mockPosts if needed for looping effect
const getCarouselPosts = (posts, minSlides = 6) => {
  if (!Array.isArray(posts) || posts.length === 0) return [];

  if (posts.length >= minSlides) return posts;

  const repeatCount = Math.ceil(minSlides / posts.length);
  return Array(repeatCount).fill(posts).flat().slice(0, minSlides);
};

const PriorityPostsSlider = () => {
  // const {posts } = usePosts();
  // const carouselPosts = getCarouselPosts(posts);
  const { isPending, posts } = usePosts({ postLabel: POST_LABEL_PRIORITY });
  const carouselPosts = getCarouselPosts(posts);

  return (
    <section className="hero-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-12 justify-content-between">
            <div className="text-center mb-5 pb-2">
              <h1 className="text-white">Welcome to Back To You</h1>
              <p className="text-white">
                Lost something? Let’s bring it back to you.
              </p>
              <Link
                to="/listing/create"
                className="btn custom-btn btn2 smoothscroll mt-3 me-1"
              >
                <i className="bi-pencil-square me-2"></i>
                Đăng bài
              </Link>
              <Link
                to="/ai-search"
                className="btn custom-btn btn2 smoothscroll mt-3 ms-1"
              >
                <i className="bi-robot me-2"></i>
                Tìm kiếm
              </Link>
            </div>

            {isPending ? (
              <Spinner />
            ) : carouselPosts.length === 0 ? (
              <p className="text-center">Chưa có bài viết ưu tiên nào</p>
            ) : (
              <Swiper
                className="owl-carousel owl-theme"
                {...swiperOptions}
                onSwiper={handleSwiperHover}
              >
                {carouselPosts.map((post, index) => (
                  <SwiperSlide
                    className="owl-carousel-info-wrap item "
                    key={index}
                  >
                    <div className="img-wrapper img-height-priority">
                      <Link to={`/${post.slug}`} state={{ post }}>
                        <img
                          src={post.thumbnailUrl}
                          className="owl-carousel-image img-fluid"
                          alt={post.title}
                        />
                      </Link>
                    </div>

                    <div className="owl-carousel-info">
                      <h4 className="mb-2 ">
                        <Link
                          className="line-clamp-carousel-title"
                          to={`/${post.slug}`}
                          state={{ post }}
                        >
                          {post.title}
                        </Link>
                      </h4>
                      <div className="d-flex align-items-center">
                        <PostTypeBadge type={post.postType} />
                        <span className="badge badge-category d-flex align-items-center mb-1">
                          <i className="bi-box me-1"></i>
                          {post.category?.name}
                        </span>
                      </div>
                      <span className="badge">
                        <i className="bi-geo-alt me-1"></i>
                        {post.location.district}, {post.location.province}
                      </span>
                    </div>
                    <PriorityLabel postLabel={post.postLabel} />
                    <div className="social-share">
                      <ul className="social-icon">
                        <li className="social-icon-item" >
                          <LinkShareFbIcon/>
                        </li>
                      </ul>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriorityPostsSlider;
