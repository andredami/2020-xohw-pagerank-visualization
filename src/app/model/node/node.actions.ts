import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Node } from './node.model';

export enum NodeActionTypes {
  LoadNodes = '[Node] Load Nodes',
  AddNode = '[Node] Add Node',
  UpsertNode = '[Node] Upsert Node',
  AddNodes = '[Node] Add Nodes',
  UpsertNodes = '[Node] Upsert Nodes',
  UpdateNode = '[Node] Update Node',
  UpdateNodes = '[Node] Update Nodes',
  DeleteNode = '[Node] Delete Node',
  DeleteNodes = '[Node] Delete Nodes',
  ClearNodes = '[Node] Clear Nodes',
  ToggleNodeSelection = '[Node] Toggle Node Selection',
  LoadNeighborNodes = '[Node] Load Neighbor Nodes',
  LoadNeighborNodesError = '[Node] Load Neighbor Nodes Error',
  ShowNode = '[Node] Show Node',
  ShowSomeNodes = '[Node] Show Some Nodes'
}

export class LoadNodes implements Action {
  readonly type = NodeActionTypes.LoadNodes;

  constructor(public payload: { nodes: Node[] }) {}
}

export class AddNode implements Action {
  readonly type = NodeActionTypes.AddNode;

  constructor(public payload: { node: Node }) {}
}

export class UpsertNode implements Action {
  readonly type = NodeActionTypes.UpsertNode;

  constructor(public payload: { node: Node }) {}
}

export class AddNodes implements Action {
  readonly type = NodeActionTypes.AddNodes;

  constructor(public payload: { nodes: Node[] }) {}
}

export class UpsertNodes implements Action {
  readonly type = NodeActionTypes.UpsertNodes;

  constructor(public payload: { nodes: Node[] }) {}
}

export class UpdateNode implements Action {
  readonly type = NodeActionTypes.UpdateNode;

  constructor(public payload: { node: Update<Node> }) {}
}

export class UpdateNodes implements Action {
  readonly type = NodeActionTypes.UpdateNodes;

  constructor(public payload: { nodes: Update<Node>[] }) {}
}

export class DeleteNode implements Action {
  readonly type = NodeActionTypes.DeleteNode;

  constructor(public payload: { id: number }) {}
}

export class DeleteNodes implements Action {
  readonly type = NodeActionTypes.DeleteNodes;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearNodes implements Action {
  readonly type = NodeActionTypes.ClearNodes;
}

export class ToggleNodeSelection implements Action {
  readonly type = NodeActionTypes.ToggleNodeSelection;

  constructor(public payload: { id: number }) {}
}

export class LoadNeighborNodes implements Action {
  readonly type = NodeActionTypes.LoadNeighborNodes;

  constructor(public payload: { from: Node }) {}
}

export class LoadNeighborNodesError implements Action {
  readonly type = NodeActionTypes.LoadNeighborNodesError;

  constructor(public payload: { error: any }) {}
}

export class ShowNode implements Action {
  readonly type = NodeActionTypes.ShowNode;

  constructor(public payload: { node: Node }) {}
}


export class ShowSomeNodes implements Action {
  readonly type = NodeActionTypes.ShowSomeNodes;

  constructor(public payload: { from: Node, max: number }) {}
}

export type NodeActions =
 LoadNodes
 | AddNode
 | UpsertNode
 | AddNodes
 | UpsertNodes
 | UpdateNode
 | UpdateNodes
 | DeleteNode
 | DeleteNodes
 | ClearNodes
 | ToggleNodeSelection
 | LoadNeighborNodes
 | LoadNeighborNodesError
 | ShowNode
 | ShowSomeNodes;
