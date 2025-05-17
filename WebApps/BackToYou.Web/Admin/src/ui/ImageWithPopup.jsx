import { useState } from "react";
import styled from "styled-components";

const ImageWrapper = styled.div`
  img {
    width: 100%;
    height: auto;
    border-radius: var(--border-radius-medium);
    object-fit: cover;
    cursor: zoom-in;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  max-width: 90%;
  max-height: 90%;
  img {
    width: 100%;
    height: auto;
    border-radius: var(--border-radius-medium);
    object-fit: contain;
  }
`;

function ImageWithPopup({ src, alt }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ImageWrapper>
        <img
          src={src}
          alt={alt}
          className="custom-block-image img-fluid"
          onClick={() => setIsOpen(true)}
        />
      </ImageWrapper>

      {isOpen && (
        <ModalOverlay onClick={() => setIsOpen(false)}>
          <ModalContent>
            <img src={src} alt={alt} />
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}

export default ImageWithPopup;