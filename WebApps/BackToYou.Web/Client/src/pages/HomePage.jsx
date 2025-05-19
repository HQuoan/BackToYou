// import PriorityPostsSlider from '../ui/PriorityPostsSlider';
// import Categories from '../ui/Categories';

import Categories from "../ui/homepage/Categories";
import PriorityPostsSlider from "../ui/homepage/PriorityPostsSlider";
import RecentPosts from "../ui/homepage/RecentPosts";
import { POST_LABEL_NORMAL } from "../utils/constants";

function Homepage() {
  return(
    <>
      <PriorityPostsSlider />
      <Categories />
      <RecentPosts  postLabel={POST_LABEL_NORMAL}/>
    </>
  )
}

export default Homepage;