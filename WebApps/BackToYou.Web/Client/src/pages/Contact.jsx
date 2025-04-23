import Categories from "../ui/Categories";

function Contact() {
  return (
    <>
      <div className="site-header"></div>
      <section className="latest-podcast-section section-padding pb-0">
        <div className="container">
        <h1>Contact page</h1>
        </div>
        <Categories />
      </section>
    </>
  );
}

export default Contact;

// function Contact() {
//   return (
//     <>
//       <div className="site-header">Test</div>
//       <section
//         className="latest-podcast-section section-padding pb-0"
//         style={{ minHeight: 400 }}
//       >
//         <div className="container"></div>
//         <h1>Contact page</h1>
//         <Topics />
//       </section>
//     </>
//   );
// }
