import { Handle, NodeProps, Position } from '@xyflow/react';

import "./nodes.css"
import "../index.css"

export default function InitialState({ id, sourcePosition, data } : NodeProps) {
  

  return (
    <div className="initial-state poppins-regular">
      <h3>{id}</h3>
      <input type="checkbox" onChange={() => {
        data.onFinalStateCheck(id)
      }} />
      <Handle
        style={{
          width:"10px",
          height:"10px"
        }}
        type="source"
        position={Position.Right}
        id="0"
      />
      <Handle
        style={{
          width:"10px",
          height:"10px"
        }}
        type="source"
        position={sourcePosition || Position.Left}
        id="1"      />
      <Handle
        style={{
          width:"10px",
          height:"10px"
        }}
        type="target"
        id='self'
        position={Position.Top}
      />
    </div>
  );
}
