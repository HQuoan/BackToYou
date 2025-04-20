const latestEpisodes = [
  {
    title: 'Modern Vintage', time: '50 Minutes', episode: 15,
    image: '/images/podcast/11683425_4790593.jpg', host: {name:'Elsa', role:'Influencer', avatar:'/images/profile/woman-posing-black-dress-medium-shot.jpg'},
    stats: { listens:'120k', likes:'42.5k', comments:'11k', downloads:'50k' }
  },
  {
    title: 'Daily Talk', time: '15 Minutes', episode: 45,
    image: '/images/podcast/12577967_02.jpg', host: {name:'William', role:'Vlogger', avatar:'/images/profile/handsome-asian-man-listening-music-through-headphones.jpg'},
    stats: { listens:'140k', likes:'22.4k', comments:'16k', downloads:'62k' }
  }
];

const LatestEpisodes = () => (
  <section className="latest-podcast-section section-padding pb-0" id="section_2">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-12 col-12">
          <div className="section-title-wrap mb-5">
            <h4 className="section-title">Lastest episodes</h4>
          </div>
        </div>
        {latestEpisodes.map((ep, i) => (
          <div key={i} className="col-lg-6 col-12 mb-4 mb-lg-0">
            <div className="custom-block d-flex">
              <div>
                <div className="custom-block-icon-wrap">
                  <div className="section-overlay"></div>
                  <a href="/detail-page" className="custom-block-image-wrap">
                    <img src={ep.image} className="custom-block-image img-fluid" alt={ep.title} />
                    <div href="#" className="custom-block-icon"><i className="bi-play-fill"></i></div>
                  </a>
                </div>
                <div className="mt-2"><a href="#" className="btn custom-btn">Subscribe</a></div>
              </div>
              <div className="custom-block-info">
                <div className="custom-block-top d-flex mb-1">
                  <small className="me-4"><i className="bi-clock-fill custom-icon"></i>{ep.time}</small>
                  <small>Episode <span className="badge">{ep.episode}</span></small>
                </div>
                <h5 className="mb-2"><a href="/detail-page">{ep.title}</a></h5>
                <div className="profile-block d-flex">
                  <img src={ep.host.avatar} className="profile-block-image img-fluid" alt={ep.host.name} />
                  <p>{ep.host.name} <img src="/images/verified.png" className="verified-image img-fluid" alt="" /><strong>{ep.host.role}</strong></p>
                </div>
                <p className="mb-0">Lorem Ipsum dolor sit amet consectetur</p>
                <div className="custom-block-bottom d-flex justify-content-between mt-3">
                  <a href="#" className="bi-headphones me-1"><span>{ep.stats.listens}</span></a>
                  <a href="#" className="bi-heart me-1"><span>{ep.stats.likes}</span></a>
                  <a href="#" className="bi-chat me-1"><span>{ep.stats.comments}</span></a>
                  <a href="#" className="bi-download"><span>{ep.stats.downloads}</span></a>
                </div>
              </div>
              <div className="d-flex flex-column ms-auto">
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

export default LatestEpisodes;