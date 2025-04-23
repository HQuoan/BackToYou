import HeroSection from '../components/HeroSection';
import Topics from '../ui/Categories';
import Trending from '../ui/RecentPosts';
import Categories from '../ui/Categories';

function Homepage() {
  return(
    <>
      <HeroSection />
      <Categories />
      <Trending />
    </>
  )
}

export default Homepage;