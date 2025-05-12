import { Link } from 'react-router-dom';

const ViewingHistory = () => {
  const historyItems = [
    {
      id: 1,
      title: "Mục Thần Ký (30/78) [4K]",
      date: "2025-05-11 19:59:56",
      image: "path/to/image1.jpg",
      link: "/watch/muc-than-ky",
    },
    {
      id: 2,
      title: "Tiên Nghịch (48/54) [4K]",
      date: "2025-05-11 19:20:10",
      image: "path/to/image2.jpg",
      link: "/watch/tien-nghich",
    },
    {
      id: 3,
      title: "Đấu Phá Thương Khung Phần 5-6 (46/157) [4K]",
      date: "2025-05-10 22:31:01",
      image: "path/to/image3.jpg",
      link: "/watch/dau-pha-thuong-khung",
    },
    {
      id: 4,
      title: "Phàm Nhân Tu Tiên [FULL] (142/...) [4K]",
      date: "2025-05-10 21:39:34",
      image: "path/to/image4.jpg",
      link: "/watch/pham-nhan-tu-tien",
    },
    {
      id: 5,
      title: "Thương Nguyệt Đồ [FULL] (54/57) [4K]",
      date: "2025-05-09 19:24:52",
      image: "path/to/image5.jpg",
      link: "/watch/thuong-nguyet-do",
    },
  ];

  const clearHistory = () => {
    // Logic để xóa lịch sử xem
    console.log("Clearing history...");
  };

  return (
    <div className="history-section">
      <div className="history-header">
        <h2 className="text-black-custom">Lịch sử xem</h2>
        <button className="custom-btn history-clear-btn" onClick={clearHistory}>
          Xóa lịch sử xem
        </button>
      </div>
      <p className="text-grey-custom">
        Bạn đã xem {historyItems.length} phim gần đây
      </p>
      <div className="history-list">
        {historyItems.map((item) => (
          <div key={item.id} className="history-item">
            <Link to={item.link} className="history-item-image-wrapper">
              <img src={item.image} alt={item.title} className="history-item-image" />
            </Link>
            <div className="history-item-info">
              <Link to={item.link} className="history-item-title">
                {item.title}
              </Link>
              <p className="history-item-date text-grey-custom">
                Bạn đã xem tập này vào {item.date}
              </p>
              <Link to={item.link} className="history-item-continue text-primary-custom">
                Xem tiếp
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewingHistory;