import Map from "../ui/map/Map"
import SideBar from "../ui/SideBar"

function MapPage() {
  return (
    <>
      <div className="site-header"></div>
      <div className="container header-content-overlay">
        <div className="row">
          <header className=" d-flex flex-column justify-content-center align-items-center">
            <div className="col-lg-12 col-12 text-center">
              <h2 className="mb-1 text-white">Lost & Found Map</h2>
            </div>
          </header>
        </div>
        <div className="row bg-white shadow rounded p-3">
          <div className="col-md-3 scrollable-sidebar">
            <SideBar />
          </div>
          <div className="col-md-9">
            <div className="row">
              <Map/>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MapPage
