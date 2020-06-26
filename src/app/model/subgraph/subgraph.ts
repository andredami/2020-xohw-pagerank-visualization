/**
 * Contributor: Gabriele Bonzi <gabriele.bonzi@mail.polimi.it>
 */

import { Node } from '../node/node.model';
import { Edge } from '../edge/edge.model';

export interface Subgraph {
  nodes: Node[];
  edges: Edge[];
}
