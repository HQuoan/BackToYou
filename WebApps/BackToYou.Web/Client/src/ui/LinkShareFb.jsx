const VITE_DOMAIN = import.meta.env.VITE_DOMAIN;

function LinkShareFb({ slug }) {
  const handleShare = () => {
    const width = 600;
    const height = 400;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
  
    const shareUrl = `https://www.facebook.com/share.php?u=${encodeURIComponent(
      `${VITE_DOMAIN}/${slug}`
    )}`;
  
    window.open(
      shareUrl,
      "facebook-share-dialog",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  };
  

  return (
    <button onClick={handleShare} className="btn btn-link p-0">
      <i className="bi-share me-2"></i>
      Share
    </button>
  );
}

export default LinkShareFb;
