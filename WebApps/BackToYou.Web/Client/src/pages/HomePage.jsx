// import PriorityPostsSlider from '../ui/PriorityPostsSlider';
// import Categories from '../ui/Categories';

import Categories from "../ui/homepage/Categories";
import PriorityPostsSlider from "../ui/homepage/PriorityPostsSlider";
import RecentPosts from "../ui/homepage/RecentPosts";

function Homepage() {
  return(
    <>
      <PriorityPostsSlider />
      <Categories />
      <RecentPosts />
    </>
  )
}

export default Homepage;