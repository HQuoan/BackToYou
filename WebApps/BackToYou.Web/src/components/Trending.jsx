const trending = [
  { title:'Vintage Show', image:'/images/podcast/27376480_7326766.jpg', host:{name:'Elsa', role:'Influencer', avatar:'/images/profile/woman-posing-black-dress-medium-shot.jpg'}, stats:{listens:'100k', likes:'2.5k', comments:'924k'} },
  { title:'Vintage Show', image:'/images/podcast/27670664_7369753.jpg', host:{name:'Taylor', role:'Creator', avatar:'/images/profile/cute-smiling-woman-outdoor-portrait.jpg'}, stats:{listens:'100k', likes:'2.5k', comments:'924k'} },
  { title:'Daily Talk', image:'/images/podcast/12577967_02.jpg', host:{name:'William', role:'Vlogger', avatar:'/images/profile/handsome-asian-man-listening-music-through-headphones.jpg'}, stats:{listens:'100k', likes:'2.5k', comments:'924k'} }
];

const Trending = () => (
  <section className="trending-podcast-section section-padding">
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-12">
          <div className="section-title-wrap mb-5"><h4 className="section-title">Trending episodes</h4></div>
        </div>
        {trending.map((item,i) => (
          <div key={i} className="col-lg-4 col-12 mb-4 mb-lg-0">
            <div className="custom-block custom-block-full">
              <div className="custom-block-image-wrap">
                <a href="/detail-page"><img src={item.image} className="custom-block-image img-fluid" alt={item.title} /></a>
              </div>
              <div className="custom-block-info">
                <h5 className="mb-2"><a href="/detail-page">{item.title}</a></h5>
                <div className="profile-block d-flex">
                  <img src={item.host.avatar} className="profile-block-image img-fluid" alt={item.host.name} />
                  <p>{item.host.name}<strong>{item.host.role}</strong></p>
                </div>
                <p className="mb-0">Lorem Ipsum dolor sit amet consectetur</p>
                <div className="custom-block-bottom d-flex justify-content-between mt-3">
                  <a href="#" className="bi-headphones me-1"><span>{item.stats.listens}</span></a>
                  <a href="#" className="bi-heart me-1"><span>{item.stats.likes}</span></a>
                  <a href="#" className="bi-chat me-1"><span>{item.stats.comments}</span></a>
                </div>
              </div>
              <div className="social-share d-flex flex-column ms-auto">
                <a href="#" className="badge ms-auto"><i className="bi-heart"></i></a>
                <a href="#" className="badge ms-auto"><i className="bi-bookmark"></i></a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Trending;