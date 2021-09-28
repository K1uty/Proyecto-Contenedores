import React, { useEffect, useRef } from "react";
import { Transformer } from "react-konva";

const RectTransformer = ({ selectedShapeName = "" }) => {
  const transRef = useRef();

  useEffect(() => {
    checkNode();
  });

  const checkNode = () => {
    const stage = transRef.current.getStage();
    const selectedNode = stage.findOne(`.${selectedShapeName}`);
    if (selectedNode === transRef.current.node()) {
      return;
    }

    if (selectedNode) {
      transRef.current.attachTo(selectedNode);
    } else {
      transRef.current.detach();
    }
  };

  return <Transformer ref={transRef} rotateEnabled={false} ignoreStroke />;
};

export default RectTransformer;
