import type { NodeTypes } from '@xyflow/react';

import { PositionLoggerNode } from './PositionLoggerNode';
import { AppNode } from './types';



export const initialNodes: AppNode[] = [
  { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A' } },
  {
    id: 'b',
    position: { x: -100, y: 100 },
    data: { label: 'B' },
  },
  { id: 'c', position: { x: 100, y: 100 }, data: { label: 'C' } },
  {
    id: 'd',
    position: { x: 0, y: 200 },
    data: { label: 'D' },
  },
];



export const nodeTypes = {
  'position-logger': PositionLoggerNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;
