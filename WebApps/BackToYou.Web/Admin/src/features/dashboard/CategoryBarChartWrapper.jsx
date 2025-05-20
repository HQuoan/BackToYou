import CategoryBarChart from "./CategoryBarChart";


function CategoryBarChartWrapper() {
 const data =  {
    "timePeriod": "2025-05-13 to 2025-05-20",
    "categories": [
      {
        "categoryId": "11111111-1111-1111-1111-111111111111",
        "categoryName": "Giấy tờ tùy thân",
        "postCount": 876
      },
      {
        "categoryId": "77777777-7777-7777-7777-777777777777",
        "categoryName": "Khác",
        "postCount": 30
      },
      {
        "categoryId": "66666666-6666-6666-6666-666666666666",
        "categoryName": "Xe cộ",
        "postCount": 40
      },
      {
        "categoryId": "55555555-5555-5555-5555-555555555555",
        "categoryName": "Thiết bị điện tử",
        "postCount": 44
      },
      {
        "categoryId": "44444444-4444-4444-4444-444444444444",
        "categoryName": "Trang sức",
        "postCount": 1
      },
      {
        "categoryId": "33333333-3333-3333-3333-333333333333",
        "categoryName": "Thú cưng",
        "postCount": 3
      }
    ]
  }

  // if (isLoading) return <div>Đang tải...</div>;
  // if (error) return <div>Lỗi: {error.message}</div>;
  // if (!data.result.categories.length) return <div>Không có bài đăng trong 7 ngày qua</div>;

  return <CategoryBarChart postsByCategory={[data]} />;
}


export default CategoryBarChartWrapper;