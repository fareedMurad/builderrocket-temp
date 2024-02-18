import React, { useState } from "react";
import Lightbox from "react-image-lightbox";

const CustomLightbox = ({ images, size, singleImageProps = {} }) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ marginTop: "-4px" }}>
      <img
        width={size || "50"}
        height={size || "50"}
        alt="template item"
        src={images[0]}
        onClick={() => setIsOpen(true)}
        style={{ cursor: "pointer" }}
        {...singleImageProps}
      />
      {isOpen && (
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + images.length - 1) % images.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % images.length)
          }
        />
      )}
    </div>
  );
};

export default CustomLightbox;
