import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as nodeActions from 'src/app/model/node/node.actions';

import { Node, createNode } from 'src/app/model/node/node.model';
import { Edge } from 'src/app/model/edge/edge.model';

import * as fromRoot from 'src/app/model/reducers';

@Component({
  selector: 'app-graph-page',
  templateUrl: './graph-page.component.html',
  styleUrls: ['./graph-page.component.css']
})
export class GraphPageComponent implements OnInit {

  nodes$: Observable<Node[]>;
  edges$: Observable<Edge[]>;
  selectedNodes$: Observable<Node[]>;

  constructor(
    private store: Store<fromRoot.State>,
  ) {
    this.nodes$ = this.store.pipe(select(fromRoot.getVisibleNodes));
    this.edges$ = this.store.pipe(select(fromRoot.getValidEdges));
    this.selectedNodes$ = this.store.pipe(select(fromRoot.getSelectedNodes));
  }

  ngOnInit() {
    const initialNode = createNode({
      id: 0,
    });
    this.store.dispatch(new nodeActions.AddNode({ node: initialNode }));
    this.store.dispatch(new nodeActions.LoadNeighborNodes({ from: initialNode }));
  }

  onToggleSelection(node: Node) {
    this.store.dispatch(new nodeActions.ToggleNodeSelection({ id: node.id }));
    this.store.dispatch(new nodeActions.LoadNeighborNodes({ from: node }));
  }

}
