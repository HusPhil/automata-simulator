import React, { useCallback } from 'react';
import { Handle, NodeProps, Position } from '@xyflow/react';

import "./nodes.css"

function CustomNode({ data, isConnectable } : NodeProps) {
  const onChange = useCallback((evt : React.ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="custom-node">
      <Handle
        type="target"
        position={Position.Left}
        id="0"
        isConnectable={isConnectable}
      />
      <div>
        <label htmlFor="text">{`${data.label} + ediwow`}</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
        <label htmlFor="finalState">Final?</label>
        <input id="finalState" type="checkbox" />
      </div>
      <Handle
        type="target"
        position={Position.Bottom}
        id="1"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="c"
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default CustomNode;