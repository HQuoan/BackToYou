import { useMoveBack } from "../hooks/useMoveBack";

function PageNotFound() {
  const moveBack = useMoveBack();

  return (
    <main className="page-not-found d-flex align-items-center justify-content-center p-5">
      <div
        className="box bg-white border rounded p-5 text-center w-100"
        style={{ maxWidth: "960px" }}
      >
        <h3 className="mb-4">
          Trang bạn đang tìm kiếm không thể được tìm thấy. 😢
        </h3>
        <button onClick={moveBack} className="btn btn-primary btn-lg">
          &larr; Go back
        </button>
      </div>
    </main>
  );
}

export default PageNotFound;
