import React, { useState, useEffect } from "react";
import { Image } from "react-konva";

const AnnotationImage = ({
  imageURL = ""
}) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = imageURL;
    img.onload = () => {
      setImage(img);
    };
  }, [imageURL]);

  return <Image height={window.innerHeight} width={window.innerWidth} image={image} />;
};

export default AnnotationImage;
