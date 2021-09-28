import React, { useState, useEffect } from "react";
import { Image } from "react-konva";

const AnnotationImage = ({
  imageURL = "https://i1.wp.com/hipertextual.com/wp-content/uploads/2013/04/Paris.jpg?fit=1024%2C685&ssl=1"
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
