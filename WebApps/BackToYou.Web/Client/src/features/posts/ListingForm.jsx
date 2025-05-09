import ContactInfoSection from "./ContactInfoSection"
import GeneralInfoSection from "./GeneralInfoSection"
import LocationSection from "./LocationSection"
import PhotoUploadSection from "./PhotoUploadSection"

function ListingForm({onSubmit, setShowManual,showManual }) {
  return (
    <form onSubmit={onSubmit} className="main-content p-4">
      <h2 className="mb-4 text-center">Chi tiết bài đăng</h2>
      <GeneralInfoSection />
      <LocationSection setShowManual={setShowManual} showManual={showManual} />
      <PhotoUploadSection />
      <ContactInfoSection />
      <div className="d-flex justify-content-end mt-4">
        <button className="btn custom-btn w-100">Preview</button>
        <button type="submit" className="btn btn-link w-100">Skip preview and submit</button>
      </div>
    </form>
  )
}

export default ListingForm
