import { SimulationNodeDatum } from 'd3';

const APPLICATION_NODE_TYPE_SIGNAL = 'APPLICATION_NODE_TYPE_SIGNAL';
export interface Node extends SimulationNodeDatum, BareNode {
  APPLICATION_NODE_TYPE: typeof APPLICATION_NODE_TYPE_SIGNAL;
}

interface BareNode {
  id: number;
  linkCount?: number;
}

export function createNode(node: BareNode): Node {
  return {
    APPLICATION_NODE_TYPE: APPLICATION_NODE_TYPE_SIGNAL,
    ...node,
  };
}

export function isNode(node: any): node is Node {
  return (
    'APPLICATION_NODE_TYPE' in node &&
    node.APPLICATION_NODE_TYPE === APPLICATION_NODE_TYPE_SIGNAL &&
    'id' in node &&
    typeof node.id === 'number'
  );
}
