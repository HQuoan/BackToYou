import { usePosts } from "../features/posts/usePosts";

function Contact() {

    const { isPending, posts } = usePosts();
  console.log(posts)
  const carouselPosts = posts;
  return (
    <>
      <div className="site-header">Test</div>
      <section
        className="latest-podcast-section section-padding pb-0"
        style={{ minHeight: 400 }}
      >
        <div className="container"></div>
        <h1>Contact page</h1>
        {/* <Topics /> */}
      </section>
    </>
  );
}


export default Contact;

