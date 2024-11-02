import { Handle, NodeProps, Position } from '@xyflow/react';

import "./nodes.css"
import "../index.css"

export default function NormalState({ id, data } : NodeProps) {
  
  return (
    <div className="normal-state poppins-regular">
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
        id='0'
        position={Position.Right}
      />
      <Handle
        style={{
          width:"10px",
          height:"10px"
        }}
        id='1'
        type="source"
        position={Position.Bottom}
      />
      <Handle
        style={{
          width:"10px",
          height:"10px"
        }}
        type="target"
        id="input"
        position={Position.Left}
      />
    </div>
  );
}
