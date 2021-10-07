import React, { useLayoutEffect, useRef } from "react";
import { Rect, Circle, Transformer } from "react-konva";

const Rectangulo = (props) => {
  const rectRef = useRef();
  const deleteButton = useRef();
  const trRef = useRef();

  useLayoutEffect(() => {
    if (props.isSelected) {
      trRef.current.nodes([rectRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [props.isSelected]);

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

  const handleDelete = () => {
    props.unSelectShape(null);
    props.onDelete(rectRef.current);
  };

  return (
    <>
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
        onClick={props.onSelect}
        onDragMove={(e) => {
          const stage = e.target.getStage();

          e.target.x(
            Math.max(
              0,
              Math.min(e.target.x(), stage.width() - e.target.width())
            )
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
      {props.isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        >
          <Circle
            radius={8}
            fill="red"
            ref={deleteButton}
            onClick={handleDelete}
            x={
              rectRef.current.width() < 0
                ? rectRef.current.width() * -1
                : rectRef.current.width() * 1
            }
          ></Circle>
        </Transformer>
      )}
    </>
  );
};

export default Rectangulo;
