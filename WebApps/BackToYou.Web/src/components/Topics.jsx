const topics = [
  { title:'Productivity', image:'/images/topics/physician-consulting-his-patient-clinic.jpg', episodes:50 },
  { title:'Technician', image:'/images/topics/repairman-doing-air-conditioner-service.jpg', episodes:12 },
  { title:'Mindfullness', image:'/images/topics/woman-practicing-yoga-mat-home.jpg', episodes:35 },
  { title:'Cooking', image:'/images/topics/delicious-meal-with-sambal-arrangement.jpg', episodes:12 }
];

const Topics = () => (
  <section className="topics-section section-padding pb-0" id="section_3">
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-12">
          <div className="section-title-wrap mb-5"><h4 className="section-title">Topics</h4></div>
        </div>
        {topics.map((topic,i) => (
          <div key={i} className="col-lg-3 col-md-6 col-12 mb-4 mb-lg-0">
            <div className="custom-block custom-block-overlay">
              <a href="/detail-page" className="custom-block-image-wrap">
                <img src={topic.image} className="custom-block-image img-fluid" alt={topic.title} />
              </a>
              <div className="custom-block-info custom-block-overlay-info">
                <h5 className="mb-1"><a href="/listing-page">{topic.title}</a></h5>
                <p className="badge mb-0">{topic.episodes} Episodes</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Topics;