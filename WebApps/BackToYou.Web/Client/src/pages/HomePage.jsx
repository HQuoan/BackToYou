import PriorityPostsSlider from '../ui/PriorityPostsSlider';
import Trending from '../ui/RecentPosts';
import Categories from '../ui/Categories';

function Homepage() {
  return(
    <>
      <PriorityPostsSlider />
      <Categories />
      <Trending />
    </>
  )
}

export default Homepage;