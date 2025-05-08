import { useUser } from "../features/users/useUsers";

function Contact() {
  const {profile} = useUser();

  console.log(profile)

  return (
    <>
      <div className="site-header"></div>
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

