const PostPreview = () => {
  const postData = {
    title: "Cách tìm đồ thất lạc hiệu quả",
    description: "Ứng dụng sử dụng AI để hỗ trợ tìm kiếm...",
    image: "https://res.cloudinary.com/duszcscrh/image/upload/v1748194564/post/gii258lqhfbjzacg2btx.jpg",
    link: "http://localhost:3000/tesst-1748194562"
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <img src={postData.image} className="card-img-top" alt={postData.title} style={{ height: '200px', objectFit: 'cover' }} />
        <div className="card-body">
          <h2 className="card-title h5 fw-bold">{postData.title}</h2>
          <p className="card-text text-muted">{postData.description}</p>
          <div className="mt-3">
            <h3 className="h6 fw-semibold">Link Preview</h3>
            <iframe
              src={postData.link}
              className="w-100 border rounded"
              style={{ height: '300px' }}
              title="Link Preview"
              sandbox="allow-same-origin allow-scripts"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;