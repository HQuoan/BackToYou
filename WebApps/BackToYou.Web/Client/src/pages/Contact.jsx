import { useUser } from "../features/authentication/useUser";
import Spinner from "../ui/Spinner";

function Contact() {


  return (
    <>
      <div className="site-header"></div>
      <section style={{ minHeight: 400 }}>
        <div className="d-flex justify-content-center align-items-center">
          <Spinner />
        </div>
      </section>
    </>
  );
}

export default Contact;
