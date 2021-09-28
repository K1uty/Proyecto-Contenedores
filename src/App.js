import { Layer, Stage, Rect, Line } from "react-konva";
import { useState, useEffect, useRef } from "react";
import shortid from "shortid";

import Rectangulo from "./Rectangulo/Rectangulo";
import RectTransfomer from "./Rectangulo/RectTransformer";
import AnnotationImage from "./AnnotationImage/AnnotationImage";

const App = () => {
  const stageRef = useRef();
  const imgLayerRef = useRef();

  const [rectangles, setRectangles] = useState([]);
  const [rectCount, setRectCount] = useState(0);
  const [selectedShapeName, setSelectedShapeName] = useState("");
  const [mouseDown, setMouseDown] = useState(false);
  const [mouseDraw, setMouseDraw] = useState(false);
  const [newRectX, setNewRectX] = useState(0);
  const [newRectY, setNewRectY] = useState(0);
  const [poly, setPoly] = useState({
    points: [],
    curMousePos: [0, 0],
    isMouseOverStartPoint: false,
    isFinished: false,
    isPoly: false,
  });

  useEffect(() => {
    imgLayerRef && imgLayerRef.current.moveToBottom();
  }, [imgLayerRef]);

  const handleCheckboxChange = () => {
    setPoly({
      ...poly,
      isPoly: !poly.isPoly,
    });
  };

  const getMousePos = (stage) => {
    return [stage.getPointerPosition().x, stage.getPointerPosition().y];
  };

  const handleClickPoly = (e) => {
      const stage = e.target.getStage();
      const mousePos = getMousePos(stage);
      if (poly.isFinished) {
        return;
      }
      if (poly.isMouseOverStartPoint && poly.points.length >= 3) {
        setPoly({
          ...poly,
          isFinished: true,
        });
      } else {
        setPoly({
          ...poly,
          points: [...poly.points, mousePos],
        });
        console.log(poly.points)
      }
  };

  const handleMouseMovePoly = (e) => {
    const stage = e.target.getStage();
    const mousePos = getMousePos(stage);

    setPoly({
      ...poly,
      curMousePos: mousePos,
    });
  };

  const handleMouseOverStartPoint = (e) => {
    if (poly.isFinished || poly.points.length < 3) return;
    e.target.scale({ x: 2, y: 2 });
    setPoly({
      ...poly,
      isMouseOverStartPoint: true,
    });
  };

  const handleMouseOutStartPoint = (e) => {
    e.target.scale({ x: 1, y: 1 });
    setPoly({
      ...poly,
      isMouseOverStartPoint: false,
    });
  };

  const handleDragMovePoint = (e) => {
    const points = poly.points;
    const index = e.target.index - 1;
    const pos = [e.target.attrs.x, e.target.attrs.y];
    setPoly({
      ...poly,
      points: [...points.slice(0, index), pos, ...points.slice(index + 1)],
    });
  };

  const handleDragStartPoint = (event) => {
    //console.log("start", event);
  };


  const handleDragOutPoint = (event) => {
    //console.log("end", event);
  };

  const flattenedPoints = poly.points
    .concat(poly.isFinished ? [] : poly.curMousePos)
    .reduce((a, b) => a.concat(b), []);

  const _onStageMouseDown = (event) => {
    if (event.target.className === "Image") {
      const stage = event.target.getStage();
      const mousePos = stage.getPointerPosition();
      setMouseDown(true);
      setNewRectX(mousePos.x);
      setNewRectY(mousePos.y);
      setSelectedShapeName("");
      return;
    }

    const clickedOnTransformer =
      event.target.getParent().className === "Transformer";
    if (clickedOnTransformer) {
      return;
    }

    const name = event.target.name();
    const rect = rectangles.find((r) => r.name === name);
    if (rect) {
      setSelectedShapeName(name);
    } else {
      setSelectedShapeName("");
    }
  };

  const _onRectChange = (index, newProps) => {
    let updatedRect = {
      ...rectangles[index],
      ...newProps,
    };
    let newRects = [
      ...rectangles.slice(0, index),
      (rectangles[index] = updatedRect),
      ...rectangles.slice(index + 1),
    ];

    setRectangles(newRects);
  };

  const _onNewRectChange = (event) => {
    const stage = event.target.getStage();
    const mousePos = stage.getPointerPosition();

    if (!rectangles[rectCount]) {
      let newRect = {
        x: newRectX,
        y: newRectY,
        width: mousePos.x - newRectX,
        height: mousePos.y - newRectY,
        name: `rect${rectCount + 1}`,
        stroke: "#00A3AA",
        key: shortid.generate(),
      };
      setMouseDraw(true);
      setRectangles([...rectangles, newRect]);
      return;
    }

    let updatedRect = {
      ...rectangles[rectCount],
      width: mousePos.x - newRectX,
      height: mousePos.y - newRectY,
    };

    let newRects = [
      ...rectangles.slice(0, rectCount),
      (rectangles[rectCount] = updatedRect),
      ...rectangles.slice(rectCount + 1),
    ];

    return setRectangles(newRects);
  };

  const _onStageMouseUp = () => {
    if (mouseDraw) {
      setRectCount(rectCount + 1);
      setMouseDraw(false);
    }
    setMouseDown(false);
  };

  const scaleBy = 1.13;

  const _onWheel = (e) => {
    e.evt.preventDefault();
    var oldScale = stageRef.current.scaleX();

    var mousePointTo = {
      x:
        stageRef.current.getPointerPosition().x / oldScale -
        stageRef.current.x() / oldScale,
      y:
        stageRef.current.getPointerPosition().y / oldScale -
        stageRef.current.y() / oldScale,
    };

    let newScale = Math.max(
      1,
      e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy
    );

    stageRef.current.scale({ x: newScale, y: newScale });

    var newPos = {
      x:
        -(mousePointTo.x - stageRef.current.getPointerPosition().x / newScale) *
        newScale,
      y:
        -(mousePointTo.y - stageRef.current.getPointerPosition().y / newScale) *
        newScale,
    };
    stageRef.current.position(newPos);
    stageRef.current.batchDraw();
  };

  return (
    <div id="stageContainer">
      <input
        type="checkbox"
        checked={poly.isPoly}
        onChange={handleCheckboxChange}
      />
      <label>Drawing Mode</label>
      <Stage
        ref={stageRef}
        container={"stageContainer"}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={poly.isPoly ? handleClickPoly : _onStageMouseDown}
        onTouchStart={_onStageMouseDown}
        onMouseMove={
          poly.isPoly ? handleMouseMovePoly : mouseDown && _onNewRectChange
        }
        onTouchMove={mouseDown && _onNewRectChange}
        onMouseUp={mouseDown && _onStageMouseUp}
        onMouseEnd={mouseDown && _onStageMouseUp}
        onWheel={_onWheel}
      >
        <Layer>
          {rectangles.map((rect, i) => (
            <Rectangulo
              key={i}
              {...rect}
              onTransform={(newProps) => {
                _onRectChange(i, newProps);
              }}
            />
          ))}
          <RectTransfomer selectedShapeName={selectedShapeName} />
        </Layer>
        <Layer>
          <Line
            points={flattenedPoints}
            stroke="black"
            strokeWidth={5}
            closed={poly.isFinished}
          />
          {poly.points.map((point, index) => {
            const width = 6;
            const x = point[0] - width / 2;
            const y = point[1] - width / 2;
            const startPointAttr =
              index === 0
                ? {
                    hitStrokeWidth: 12,
                    onMouseOver: handleMouseOverStartPoint,
                    onMouseOut: handleMouseOutStartPoint,
                  }
                : null;
            return (
              <Rect
                key={index}
                x={x}
                y={y}
                width={width}
                height={width}
                stroke="black"
                strokeWidth={3}
                onDragStart={handleDragStartPoint}
                onDragMove={handleDragMovePoint}
                onDragEnd={handleDragOutPoint}
                draggable
                {...startPointAttr}
              />
            );
          })}
        </Layer>
        <Layer ref={imgLayerRef}>
          <AnnotationImage />
        </Layer>
      </Stage>
    </div>
  );
};

export default App;
