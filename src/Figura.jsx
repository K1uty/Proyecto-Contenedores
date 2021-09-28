import { useState } from "react";
import { Rect, Group } from "react-konva";
import Konva from 'konva';

export default function ColoredRect(props) {
  const [color, setColor] = useState({
    color: "green",
  });

  const handleClick = () => {
    if (!props.isDrawingMode) {
      setColor({
        color: Konva.Util.getRandomColor(),
      });
    }
  };

  return (
    <Group>
      <Rect
        x={props.x}
        y={props.y}
        width={props.width}
        height={props.height}
        stroke="black"
        onClick={handleClick}
        draggable
      />
    </Group>
  );
}
