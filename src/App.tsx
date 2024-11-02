import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  MarkerType,
  useReactFlow,
  NodeChange,
  Position,
  Edge
} from '@xyflow/react';
import "./App.css";
import '@xyflow/react/dist/style.css';
import CustomNode from './nodes/CustomNode';
import CustomEdge from './edges/CustomEdge';
import InitialState from './nodes/InitialState';
import NormalState from './nodes/NormalState';

type StateNode = {
  id: string;
  type: string | undefined;
  position: { x: number; y: number };
  data: { label: string, onFinalStateCheck?: (id: string) => void, isFinalState?: boolean };
  sourcePosition?: Position;
  isConnectable?: boolean;
  markerEnd?: { type: MarkerType | undefined };
  deletable?: boolean;
};

const initialNodes: StateNode[] = [
  { id: 'A', type: "initialState", position: { x: 0, y: 0 }, data: { label: '1' } }
];

const initialEdges : Edge[] = [];

const nodeTypes = {
  customNode: CustomNode,
  initialState: InitialState,
  normalState: NormalState,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [localData, setLocalData] = useState({});
  const reactFlow = useReactFlow();

  const handleFinalStateCheck = (id: string): void => {
    setNodes((nds) => {
      return nds.map((node) => {
        // console.log(node.id)
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, isFinalState: !node.data.isFinalState }
          };
        }
        return node;
      });
    });
  }
  const onPaneMouseMove = useCallback((event: React.MouseEvent) => {
    const { clientX, clientY } = event;
    setMousePosition(reactFlow.screenToFlowPosition({x: clientX, y: clientY}));
  }, [reactFlow]);

  const onConnect = useCallback((params: any) => {
    const nodeInput = prompt("Enter the input value:");
    // const existingEdge = edges.find(edge => (edge.source === params.source));
    // if (existingEdge && existingEdge.data?.toString() === nodeInput) {
    //   alert("This node already has an outgoing connection with data!");
    //   return;
    // }
    setEdges((eds) => addEdge({ ...params, data: nodeInput, markerEnd: 'arrowhead' }, eds));
  }, [setEdges, edges]);

  const handleKeyPress = useCallback((ev: KeyboardEvent) => {
    if (ev.code === 'Space') {
      const lastNode: StateNode = nodes[nodes.length - 1];
      const newId: string = lastNode.id.charCodeAt(0) < "Z".charCodeAt(0) ?
        String.fromCharCode(lastNode.id.charCodeAt(0) + 1).toUpperCase() :
        (nodes.length - 26 + 1).toString();

      const newNode: StateNode = {
        id: newId,
        position: { x: mousePosition.x - 50, y: mousePosition.y - 50},
        type: "normalState",
        data: { label: "FinalState", onFinalStateCheck: handleFinalStateCheck },
      };

      setNodes((nds: StateNode[]) => [...nds, newNode]);
    }
  }, [nodes, mousePosition, setNodes]);

  useEffect(() => {
    setNodes((nds) => {
      return nds.map((node) => {
        // console.log(node.id)
        if (node.type === "initialState") {
          return {
            ...node,
            data: { ...node.data, onFinalStateCheck: handleFinalStateCheck }
          };
        }
        return node;
      });
    });
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const handleNodeChange = useCallback((changes: NodeChange<StateNode>[]): void => {
    const filteredChanges = changes.filter(change => 
      !('id' in change) || change.id !== "A" || change.type !== "remove"
    );
    onNodesChange(filteredChanges);
  }, [onNodesChange]);

  async function testFunc(): Promise<void> {
    
    const testCase = prompt("Message here:")
    console.log("nodes:", nodes)
    const response = await axios.get('http://localhost:3000/automata/process_DFA', {
        params: {
            nodes,
            edges,
            testCase,

        }
    })

    console.log("testCase:", testCase)
    console.log("response.data.statePath:", response.data.statePath)
    // console.log(response.data.acceptStates)
    console.log("ACCEPTED:", response.data.result)
    console.log("IS VALID:", response.data.isValid)
    console.log(`${response.data.acceptStates?.length <= 0 ? "You did not specify any final states." : "You have specified final states."}`)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: "flex" }}>
      <div style={{ flex: "20%", color: "white" }}>
        {edges.map((edge: Edge) => (
          <div key={edge.id} style={{ marginBottom: '10px' }}>
            <span>{edge.source} {'->'} {edge.target} {` [DATA]: ${edge.data}`}</span>
            <button onClick={() => setEdges(edges => edges.filter(e => e.id !== edge.id))} style={{ marginLeft: '10px' }}>Delete</button>
          </div>
        ))}
        <hr />
        <button onClick={testFunc}>GET INFO LOCAL</button>
        {/* <p>{localData}</p> */}
        <hr />
        <p>FINAL STATES</p>
        {nodes.map((node: StateNode) => (
          node.data.isFinalState && (
            <div key={node.id} style={{ marginBottom: '10px' }}>
              <span>{node.id}</span>
            </div>
          )
        ))}
      </div>
      <div style={{ width: '100vw', height: '100vh', flex: "80%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodeChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onPaneMouseMove={onPaneMouseMove}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
        >
          <svg>
            <defs>
              <marker
                id="arrowhead"
                viewBox="0 0 12 12"
                refX="10"
                refY="6"
                markerUnits="strokeWidth"
                markerWidth="10"
                markerHeight="8"
                orient="auto"
              >
                <path d="M 0 0 L 12 6 L 0 12 L 3 6 Z" fill="#fff" />
              </marker>
            </defs>
          </svg>
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
        <div style={{ position: 'absolute', top: 10, right: 10, color: 'white' }}>
          <p>Flow Mouse Position: X: {mousePosition.x.toFixed(2)}, Y: {mousePosition.y.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}


