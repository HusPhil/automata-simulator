import { EdgeProps } from '@xyflow/react';
import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  getBezierPath,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Custom Edge Component with Draggable Label
function DraggableLabelEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  markerEnd,
} : EdgeProps) {
  const [labelPos, setLabelPos] = useState({ x: (sourceX + targetX) / 2, y: (sourceY + targetY) / 2 });

  // Function to update label position when dragging
  const handleDrag = (event : React.DragEvent<SVGTextElement>) => {
    const { offsetX, offsetY } = event.nativeEvent;
    setLabelPos({ x: offsetX, y: offsetY });
  };

  // Get the Bezier Path
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      {/* Edge Path */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {/* Draggable Label */}
      <text
        x={labelPos.x}
        y={labelPos.y}
        style={{ cursor: 'pointer', fontSize: 12 }}
        onMouseDown={(event) => event.preventDefault()} // Prevent default drag behavior
        onDrag={handleDrag} // Update position when dragging
      >
        {`${data?.label}` || 'Drag Me'}
      </text>
    </>
  );
}

export default DraggableLabelEdge