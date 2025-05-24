import { useState, useEffect, useRef } from "react"; // Thêm useRef
import PostCard from "../ui/PostCard";
import ImageUploadPlaceholder from "../ui/ImageUploadPlaceholder";
import { useAiSearch } from "../features/ai/useAISearch";

function AiSearchPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [textQuery, setTextQuery] = useState("");
  const [top, setTop] = useState(5);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Thêm ref để quản lý input file
  const fileInputRef = useRef(null);

  const handleClear = (e) => {
    e.preventDefault();
    setSelectedImage(null);
    setPreviewUrl(null);
    setPosts([]);
    setIsDragging(false);
    setTextQuery("");
    setTop(5);

    // Reset input file
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);

    // Reset input file
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const { isPending, aiSearch } = useAiSearch();

  const handleSearch = async (e) => {
    e.preventDefault();

    setPosts([]);
    if (!selectedImage && !textQuery) return;

    const formData = new FormData();
    formData.append("File", selectedImage);
    formData.append("TextQuery", textQuery);
    formData.append("Top", top);

    const result = await aiSearch(formData);
    setPosts(result.result || []);
  };

  // Cleanup preview URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <>
      <div className="site-header"></div>

      <div className="container header-content-overlay">
        <div className="row">
          <header className="d-flex flex-column justify-content-center align-items-center">
            <div className="col-lg-12 col-12 text-center">
              <h2 className="mb-3 text-white">Tìm kiếm thông minh với AI</h2>
              <p className="text-light text-secondary-custom">
                Tải lên hình ảnh để khám phá các món đồ thất lạc với công nghệ
                AI tiên tiến
              </p>
            </div>
          </header>
        </div>
        <form>
          <div className="row min-height-600 bg-white shadow rounded p-4">
            {/* Upload Zone */}
            <div
              className="col-12 mb-4 ai-upload-zone p-4 border rounded text-center "
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <label
                htmlFor="imageUpload"
                className="d-block cursor-pointer mb-3"
              >
                <strong className="text-primary-custom">
                  Kéo & thả ảnh hoặc chọn từ thiết bị
                </strong>
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                ref={fileInputRef} // Gắn ref vào input
              />
              {!previewUrl && (
                <div className="d-flex justify-content-center">
                  <label htmlFor="imageUpload">
                    <ImageUploadPlaceholder />
                  </label>
                </div>
              )}

              {previewUrl && (
                <div className="img-wrapper mt-3 detail-page">
                  <div className="img-preview-container">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="rounded shadow img-height-priority"
                    />
                    <button
                      type="button"
                      className="btn-remove-img"
                      onClick={handleRemoveImage}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="row justify-content-center mb-3">
              <div className="col-6 gx-2 d-flex">
                <div className="col-9 me-2">
                  <input
                    type="search"
                    className="form-control"
                    onChange={(e) => setTextQuery(e.target.value)}
                    placeholder="Nhập từ khóa..."
                    value={textQuery}
                  />
                </div>
                <div className="col-3">
                  <select
                    className="form-select"
                    onChange={(e) => setTop(e.target.value)}
                    value={top}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Search Button with Loading Animation */}
            <div className="col-12 text-center mb-4">
              <button
                type="submit"
                className="custom-btn px-5 py-3 badge"
                disabled={(!selectedImage && !textQuery) || isPending}
                onClick={handleSearch}
              >
                {isPending ? (
                  <span className="d-flex align-items-center">
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Đang phân tích...
                  </span>
                ) : (
                  "Tìm kiếm bằng AI"
                )}
              </button>
              <button
                className="custom-btn px-5 py-3 badge"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>

            {/* Search Results */}
            <div className="col-12">
              <div className="row">
                {isPending && (
                  <div className="text-center">
                    <div
                      className="spinner-border text-primary-custom"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
                {posts.length === 0 && !isPending && (
                  <div className="text-center text-secondary-custom">
                    <em>Chưa tìm thấy kết quả phù hợp...</em>
                  </div>
                )}
                {posts.map((post) => (
                  <div
                    key={post.post.postId}
                    className="col-lg-4 col-md-6 col-12 mb-4"
                  >
                    <span className="text-center badge badge-found mb-1">
                      Similarity Score: {post.similarityScore.toFixed(4)}
                    </span>
                    <PostCard post={post.post} targetImgId={post.postImageId} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default AiSearchPage;
