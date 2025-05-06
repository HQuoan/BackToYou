import { Link } from "react-router-dom";
import mockCategories from "../../data/mockCategories";

const categories = mockCategories;

const Categories = () => (
  <section className="topics-section section-padding pb-0" id="section_3">
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-12">
          <div className="section-title-wrap mb-5">
            <h4 className="section-title">Danh mục</h4>
          </div>
        </div>
        {categories.map((topic, i) => (
          <div key={i} className="col-lg-3 col-md-6 col-12 mb-5 mb-lg-0">
            <div className="custom-block custom-block-overlay">
              <Link
                to={`/search?CategorySlug=${topic.slug}`}
                className="custom-block-image-wrap"
              >
                <img
                  src={topic.image}
                  className="custom-block-image img-fluid"
                  alt={topic.name}
                />
              </Link>
              <div className="custom-block-info custom-block-overlay-info text-center">
                <h5 className="mb-1">
                  <Link to={`/search?CategorySlug=${topic.slug}`}>
                    {topic.name}
                  </Link>
                </h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Categories;
