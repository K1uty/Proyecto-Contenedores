import { Layer, Stage } from "react-konva";
import { useState, useEffect, useRef } from "react";
import shortid from "shortid";

import Rectangulo from "./Rectangulo/Rectangulo";
import AnnotationImage from "./AnnotationImage/AnnotationImage";
import ModalTest from "./Modal/Modal";

const App = () => {
  const stageRef = useRef();
  const imgLayerRef = useRef();

  const [rectangles, setRectangles] = useState([]);
  const [rectCount, setRectCount] = useState(0);
  const [selectedShape, setSelectedShape] = useState(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [mouseDraw, setMouseDraw] = useState(false);
  const [newRectX, setNewRectX] = useState(0);
  const [newRectY, setNewRectY] = useState(0);
  const [show, setShow] = useState(false);
  const [coordenadas, setCoordenadas] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    imgLayerRef && imgLayerRef.current.moveToBottom();
  }, [imgLayerRef]);

  const updateCoordenadas = (bloque) => {
    if (bloque.width > 0) {
      if (bloque.height > 0) {
        setCoordenadas({
          x: bloque.x,
          y: bloque.y,
        });
      } else {
        setCoordenadas({
          x: bloque.x,
          y: bloque.y - bloque.height * -1,
        });
      }
    } else {
      if (bloque.height > 0) {
        setCoordenadas({
          x: bloque.x - bloque.width * -1,
          y: bloque.y,
        });
      } else {
        setCoordenadas({
          x: bloque.x - bloque.width * -1,
          y: bloque.y - bloque.height * -1,
        });
      }
    }
  };

  const _onStageMouseDown = (event) => {
    if (event.target.className === "Image") {
      const stage = event.target.getStage();
      const mousePos = stage.getPointerPosition();
      setMouseDown(true);
      setShow(false);
      setNewRectX(mousePos.x);
      setNewRectY(mousePos.y);
      setSelectedShape(null);

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
      setSelectedShape(rect);
      setShow(true);
      updateCoordenadas(rect);
    } else {
      setSelectedShape(null);
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
    updateCoordenadas(updatedRect);
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

  const onDeleteBloque = (node) => {
    const newRects = [...rectangles];
    newRects.splice(node.index, 1);
    setRectangles(newRects);
    setRectCount(rectCount - 1);
    setShow(false);
  };

  const unSelectShape = (prop) => {
    setSelectedShape(prop);
  };

  return (
    <>
      <div>
        <ModalTest
          muestro={show}
          coordenadas={coordenadas}
          bloque={selectedShape}
        />
      </div>
      <div id="stageContainer">
        <Stage
          ref={stageRef}
          container={"stageContainer"}
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={_onStageMouseDown}
          onTouchStart={_onStageMouseDown}
          onMouseMove={mouseDown && _onNewRectChange}
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
                onDelete={onDeleteBloque}
                stageScale={1}
                isSelected={rect === selectedShape}
                unSelectShape={unSelectShape}
                onSelect={() => {
                  setSelectedShape(rect);
                }}
              />
            ))}
          </Layer>
          <Layer ref={imgLayerRef}>
            <AnnotationImage />
          </Layer>
        </Stage>
      </div>
    </>
  );
};

export default App;
