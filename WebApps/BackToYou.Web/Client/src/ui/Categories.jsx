const categories = [
  { name:'Giấy tờ tùy thân', image:'/images/topics/giay-to.jpg' },
  { name:'Người thân', image:'/images/topics/nguoi-2.jpg'},
  { name:'Thú cưng', image:'/images/topics/thu-cung-2.jpg'},
  { name:'Trang sức', image:'/images/topics/trang-suc-4.jpg'},
  { name:'Thiết bị điện tử', image:'/images/topics/tbdt.jpg'},
  { name:'Xe cộ', image:'/images/topics/xe2.jpg'},
  { name:'Khác', image:'/images/topics/khac.jpeg'},
];

const Categories = () => (
  <section className="topics-section section-padding pb-0" id="section_3">
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-12">
          <div className="section-title-wrap mb-5"><h4 className="section-title">Danh mục</h4></div>
        </div>
        {categories.map((topic,i) => (
          <div key={i} className="col-lg-3 col-md-6 col-12 mb-5 mb-lg-0">
            <div className="custom-block custom-block-overlay">
              <a href="/detail-page" className="custom-block-image-wrap">
                <img src={topic.image} className="custom-block-image img-fluid" alt={topic.name} />
              </a>
              <div className="custom-block-info custom-block-overlay-info text-center">
                <h5 className="mb-1"><a href="/listing-page">{topic.name}</a></h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Categories;