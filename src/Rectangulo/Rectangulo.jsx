import React, { useLayoutEffect, useRef } from "react";
import { Rect } from "react-konva";

const Rectangulo = (props) => {
  const rectRef = useRef();

  useLayoutEffect(() => {
    rectRef.current.getLayer().batchDraw();
  });

  const _onChange = (event) => {
    const shape = event.target;

    props.onTransform({
      
      x: shape.x(),
      y: shape.y(),
      width: shape.width() * shape.scaleX(),
      height: shape.height() * shape.scaleY(),
      rotation: shape.rotation(),
    });
  };

  const _onMouseEnter = (event) => {
    const shape = event.target;
    shape.stroke("#3DF6FF");
    shape.getStage().container().style.cursor = "move";
    rectRef.current.getLayer().draw();
  };

  const _onMouseLeave = (event) => {
    const shape = event.target;
    shape.stroke("#00A3AA");
    shape.getStage().container().style.cursor = "crosshair";
    rectRef.current.getLayer().draw();
  };

  return (
    <Rect
      _useStrictMode
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
      scaleX={1}
      scaleY={1}
      strokeScaleEnabled={false}
      stroke={props.stroke}
      strokeWidth={1}
      name={props.name}
      onDragEnd={_onChange}
      onTransformEnd={_onChange}
      onMouseEnter={_onMouseEnter}
      onMouseLeave={_onMouseLeave}
      onDragMove={(e) => {
        const stage = e.target.getStage();

        e.target.x(
          Math.max(0, Math.min(e.target.x(), stage.width() - e.target.width()))
        );
        e.target.y(
          Math.max(
            0,
            Math.min(e.target.y(), stage.height() - e.target.height())
          )
        );
      }}
      draggable
      ref={rectRef}
    />
  );
};

export default Rectangulo;
