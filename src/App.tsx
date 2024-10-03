import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  Edge,
  Connection,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { initialNodes, nodeTypes } from './nodes';
import { initialEdges, edgeTypes } from './edges';
import { AppNode } from './nodes/types';

interface ShowOptions {
  visible: boolean;
  nodeId: string | null;
}

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);


  const [showOptions, setShowOptions] = useState<ShowOptions>({ visible: false, nodeId: null });
  
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge({ ...params, markerEnd: { type: 'arrowclosed' } }, eds)),
    [setEdges]
  );

  const onNodeDoubleClick = (event : React.MouseEvent, node : AppNode) => {
    setShowOptions({ visible: true, nodeId: node.id });

  };

   // Close the options menu
   const closeOptions = () => setShowOptions({ visible: false, nodeId: null });

   const onPaneDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      console.log
      const newNode: AppNode = {
        id: `${nodes.length + 1}`, // Generate a unique id
        position: { x: event.clientX - 50, y: event.clientY - 50 }, // Position node where the user clicked
        data: { label: `Node ${nodes.length + 1}` },
      };

      setNodes((nds) => [...nds, newNode]); // Add new node to the state
    },
    [nodes]
  );

  useEffect(() => {
    // Add event listener for keydown
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  function handleKeyPress(this: Window, ev: KeyboardEvent) {
    if(ev.code == 'Space') {
        const newNode: AppNode = {
          id: `${nodes.length + 1}`, // Generate a unique id
          position: { x: 110, y: 110 }, // Position node where the user clicked
          data: { label: `Node ${nodes.length + 1}` },
        };
  
        setNodes((nds) => [...nds, newNode]);
    }
  }

  return (
    <div style={{
      width: "100%",
      height: "100%"
    }}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodeDoubleClick={onNodeDoubleClick}
        onPaneClick={onPaneDoubleClick}
        onNodesChange={onNodesChange}
        edges={edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
      {showOptions.visible && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            zIndex: 1000,
          }}
        >
          <h3>Options for Node {showOptions.nodeId}</h3>
          <button onClick={closeOptions}>Close</button>
          {/* Add your options here, e.g., delete, edit, etc. */}
        </div>
      )}
    </div>
  );
}


