import { FormProvider, useForm } from "react-hook-form";
import "./SideBar.css";
import { useSearchParams } from "react-router-dom";
import mockCategories from "../data/mockCategories";
import toast from "react-hot-toast";
import LocationSelector from "./LocationSelector";

const categories = mockCategories;

const today = new Date().toISOString().split("T")[0];
const now = new Date();
now.setDate(now.getDate() + 1);
const tomorrow = now.toISOString().split("T")[0];

const defaultValues = {
  postLabel: "",
  postType: "",
  keyword: "",
  categorySlug: "",
  province: "",
  district: "",
  ward: "",
  fromDate: "",
  toDate: "",
};

function SideBar() {
  const methods = useForm({ defaultValues });
  const { register, handleSubmit, reset } = methods;

  const [searchParams, setSearchParams] = useSearchParams();

  const onSubmit = (data) => {
    const from = new Date(data.fromDate);
    const to = new Date(data.toDate);

    if (data.fromDate && data.toDate && from > to) {
      toast.error("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
      return;
    }

    if (to > now) {
      toast.error("Ngày kết thúc không được lớn hơn ngày hiện tại.");
      return;
    }

    if (data.keyword) searchParams.set("Keyword", data.keyword);
    if (data.postLabel) searchParams.set("PostLabel", data.postLabel);
    if (data.postType) searchParams.set("PostType", data.postType);
    if (data.categorySlug) searchParams.set("CategorySlug", data.categorySlug);
    if (data.fromDate) searchParams.set("LostOrFoundDate.From", data.fromDate);
    if (data.toDate) searchParams.set("LostOrFoundDate.To", data.toDate);
    if (data.province) searchParams.set("Province", data.province);
    if (data.district) searchParams.set("District", data.district);
    if (data.ward) searchParams.set("Ward", data.ward);

    // // Reset phân trang về trang 1
    // searchParams.set("PageNumber", "1");
    // searchParams.set("PageSize", "9");

    setSearchParams(searchParams);
  };

  const handleReset = () => {
    reset(defaultValues);
    setSearchParams({});
  };

  return (
    <div className="sidebar-block bg-light mb-3 ">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Bộ lọc</h5>
        <button
          type="button"
          className="btn border-btn-custom"
          onClick={handleReset}
        >
          Xóa
        </button>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            className="form-control mb-3 "
            placeholder="Từ khóa tìm kiếm..."
            {...register("keyword")}
          />

          <div className="mb-3">
            <label className="form-label d-block mb-2 fw-semibold">
              Mức độ ưu tiên
            </label>
            <div className="form-check mb-2 cursor-pointer">
              <input
                type="radio"
                value="Priority"
                id="priority"
                className="form-check-input"
                {...register("postLabel")}
              />
              <label className="form-check-label" htmlFor="priority">
                Ưu tiên
              </label>
            </div>
            <div className="form-check mb-2 cursor-pointer">
              <input
                type="radio"
                value="Normal"
                id="normal"
                className="form-check-input"
                {...register("postLabel")}
              />
              <label className="form-check-label" htmlFor="normal">
                Bình thường
              </label>
            </div>

            <div className="form-check cursor-pointer">
              <input
                type="radio"
                value="Founded"
                id="founded"
                className="form-check-input"
                {...register("postLabel")}
              />
              <label className="form-check-label" htmlFor="founded">
                Đã tìm thấy
              </label>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label d-block mb-2 fw-semibold">
              Loại bài đăng
            </label>
            <div className="form-check mb-2 cursor-pointer">
              <input
                type="radio"
                value="Lost"
                id="lost"
                className="form-check-input"
                {...register("postType")}
              />
              <label className="form-check-label" htmlFor="lost">
                Mất đồ
              </label>
            </div>
            <div className="form-check cursor-pointer">
              <input
                type="radio"
                value="Found"
                id="found"
                className="form-check-input"
                {...register("postType")}
              />
              <label className="form-check-label" htmlFor="found">
                Nhặt được
              </label>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label d-block mb-2 fw-semibold">
              Danh mục
            </label>
            {categories.map((cat, index) => (
              <div className="form-check cursor-pointer mb-1" key={index}>
                <input
                  type="radio"
                  className="form-check-input"
                  id={`cat-${index}`}
                  value={cat.slug}
                  {...register("categorySlug")}
                />
                <label className="form-check-label" htmlFor={`cat-${index}`}>
                  {cat.name}
                </label>
              </div>
            ))}
          </div>

          <div className="mb-3">
            <label className="form-label d-block mb-2 fw-semibold">
              Từ ngày
            </label>
            <input
              type="date"
              className="form-control"
              {...register("fromDate")}
              max={today}
            />
            <label className="form-label d-block mb-2 mt-1 fw-semibold">
              Đến ngày
            </label>
            <input
              type="date"
              className="form-control"
              {...register("toDate")}
              max={tomorrow}
            />
          </div>

          <div className="mb-3 listing-page">
            <label className="form-label d-block mb-2 fw-semibold">
              Khu vực
            </label>
            <LocationSelector />
          </div>

          <div className="d-flex justify-content-between mt-4">
            <button type="submit" className="btn custom-btn w-100 me-2">
              Tìm kiếm
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default SideBar;
