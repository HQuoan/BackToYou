import { useForm } from "react-hook-form";

const categories = [
  { name: "Giấy tờ tùy thân", image: "/images/topics/giay-to.jpg" },
  { name: "Người thân", image: "/images/topics/nguoi-2.jpg" },
  { name: "Thú cưng", image: "/images/topics/thu-cung-2.jpg" },
  { name: "Trang sức", image: "/images/topics/trang-suc-4.jpg" },
  { name: "Thiết bị điện tử", image: "/images/topics/tbdt.jpg" },
  { name: "Xe cộ", image: "/images/topics/xe2.jpg" },
  { name: "Khác", image: "/images/topics/khac.jpeg" },
];

const today = new Date().toISOString().split("T")[0];

const defaultValues = {
  isPriority: false ,
  postType: "",
  keyword: "",
  category: "",
  province: "",
  district: "",
  ward: "",
  fromDate: "",
  toDate: today,
};

function SideBar() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
  } = useForm({ defaultValues });

  const filters = watch();

  const onSubmit = (data) => {
    const from = new Date(data.fromDate);
    const to = new Date(data.toDate);
    const now = new Date();
    
    if (data.fromDate && data.toDate && from > to) {
      alert("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
      return;
    }
  
    if (to > now) {
      alert("Ngày kết thúc không được lớn hơn ngày hiện tại.");
      return;
    }
  
    console.log(data);
  };
  

  const handleReset = () => {
    reset(defaultValues);
  };

  return (
    <div className="sidebar-block bg-light mb-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Bộ lọc</h5>
        <button type="button" className="btn border-btn-custom" onClick={handleReset}>
          Xóa
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          className="form-control mb-3 "
          placeholder="Từ khóa tìm kiếm..."
          {...register("keyword")}
        />

        <div className="form-check mb-2 cursor-pointer">
          <input
            type="checkbox"
            className="form-check-input"
            id="priority"
            {...register("isPriority")}
            defaultChecked= "true"
          />
          <label className="form-check-label" htmlFor="priority">Tin ưu tiên</label>
        </div>

        <div className="mb-3">
          <label className="form-label d-block mb-2 fw-semibold">Loại bài đăng</label>
          <div className="form-check mb-2 cursor-pointer">
            <input
              type="radio"
              value="Lost"
              id="lost"
              className="form-check-input"
              {...register("postType")}
            />
            <label className="form-check-label" htmlFor="lost">Mất đồ</label>
          </div>
          <div className="form-check cursor-pointer">
            <input
              type="radio"
              value="Found"
              id="found"
              className="form-check-input"
              {...register("postType")}
            />
            <label className="form-check-label" htmlFor="found">Nhặt được</label>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label d-block mb-2 fw-semibold">Danh mục</label>
          {categories.map((cat, index) => (
            <div className="form-check cursor-pointer mb-1" key={index}>
              <input
                type="radio"
                className="form-check-input"
                id={`cat-${index}`}
                value={cat.name}
                {...register("category")}
              />
              <label className="form-check-label" htmlFor={`cat-${index}`}>
                {cat.name}
              </label>
            </div>
          ))}
        </div>

        <div className="mb-3">
          <label className="form-label d-block mb-2 fw-semibold">Từ ngày</label>
            <input
              type="date"
              className="form-control"
              {...register("fromDate")}
              max={today}
            />
            <label className="form-label d-block mb-2 mt-1 fw-semibold">Đến ngày</label>
            <input
              type="date"
              className="form-control"
              {...register("toDate")}
              max={today}
            />
        </div>


        <div className="mb-3">
          <label className="form-label d-block mb-2 fw-semibold">Khu vực</label>
          <select className="form-select mb-2" {...register("province")}>
            <option value="">Tỉnh/Thành phố</option>
            <option value="Hồ Chí Minh">Hồ Chí Minh</option>
            <option value="Hà Nội">Hà Nội</option>
          </select>
          <select className="form-select mb-2" {...register("district")}>
            <option value="">Quận/Huyện</option>
          </select>
          <select className="form-select" {...register("ward")}>
            <option value="">Phường/Xã</option>
          </select>
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button type="submit" className="btn custom-btn w-100 me-2">
            Tìm kiếm
          </button>
        </div>
      </form>
    </div>
  );
}

export default SideBar;
