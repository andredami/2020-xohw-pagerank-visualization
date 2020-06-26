import { SimulationLinkDatum } from 'd3';
import { Node } from '../node/node.model';

export interface Edge extends SimulationLinkDatum<Node> {
  id: number;
  source: number; // id of source node
  target: number; // id of target node
}
