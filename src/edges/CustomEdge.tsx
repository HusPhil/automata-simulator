import React, { useState, useRef, useEffect } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useInternalNode,
  useReactFlow,
  addEdge,
} from '@xyflow/react';

import { getEdgeParams } from '../utils';
// import JointNode from './JointNode';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourceHandleId,
  markerEnd,
  source,
  target,
}: EdgeProps) {
  const { setEdges, getEdges, getNode } = useReactFlow();
  const [jointPosition, setJointPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  const [isEditing, setIsEditing] = useState(false);
  const [edgeText, setEdgeText] = useState(sourceHandleId);
  const inputRef = useRef<HTMLInputElement>(null);
  // const edgePath2 = getBezierPath({
  //   sourceX,
  //   sourceY,
  //   // sourcePosition: { x: 0, y: 0 },
  //   targetX,
  //   targetY,
  //   // targetPosition: { x: 0, y: 0 },
  // });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (sourceNode && targetNode) {
      const { x: sourceX, y: sourceY } = {x:0, y:0};
      const { x: targetX, y: targetY } = {x:0, y:0};
      setJointPosition({ x: (sourceX + targetX) / 2, y: (sourceY + targetY) / 2 });
    }
  }, [sourceNode, targetNode]);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const handleJointDrag = (event: React.MouseEvent) => {
    if (isDragging) {
      const { clientX, clientY } = event;
      setJointPosition({ x: clientX, y: clientY });
    }
  };

  const handleJointDragStart = () => {
    setIsDragging(true);
  };

  const handleJointDragEnd = () => {
    setIsDragging(false);
  };

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode
  );

  let edgePath, buttonX, buttonY;

  if (source === target) {
    // Edge connecting to itself (circular edge)
    const radius = 50;
    edgePath = `M ${sx} ${sy + radius} 
                A ${radius} ${radius} 0 1 1 ${sx} ${sy - radius}
                A ${radius} ${radius} 0 1 1 ${sx} ${sy + radius}
                Z`;
    buttonX = sx + radius;
    buttonY = sy;
  } else {
    edgePath = `M ${sx} ${sy} 
                 Q ${jointPosition.x} ${jointPosition.y} ${tx} ${ty}`;

    const isPointingLeft = sx > tx;
    const offsetX = isPointingLeft ? -20 : 20;
    const offsetY = sy > ty ? -20 : 20;
    buttonX = tx + offsetX;
    buttonY = ty + offsetY;
  }

  const handleEdgeClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEdgeText(event.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath2}
        markerEnd={markerEnd}
        style={{ strokeWidth: '3px' }}
      />
      

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseMove={handleJointDrag}
        onMouseDown={handleJointDragStart}
        onMouseUp={handleJointDragEnd}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${buttonX}px,${buttonY}px)`,
            pointerEvents: 'all',
            zIndex: 7777,
          }}
          className="nodrag nopan"
          onClick={handleEdgeClick}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              value={edgeText || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              style={{
                background: 'transparent',
                border: 'none',
                textAlign: 'center',
              }}
            />
          ) : (
            <span>{edgeText}</span>
          )}
        </div>
        <button
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${buttonX}px,${buttonY}px)`,
            pointerEvents: 'all',
            zIndex: 7777,
          }}
          className="nodrag nopan"
          onClick={() => {
            setEdges((es) => es.filter((e) => e.id !== id));
          }}
        >
          X
        </button>
      </EdgeLabelRenderer>
    </>
  );
}