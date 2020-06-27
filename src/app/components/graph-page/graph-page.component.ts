import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as nodeActions from 'src/app/model/node/node.actions';
import { AskPageranks } from 'src/app/model/pagerank/pagerank.actions';

import { Node, createNode } from 'src/app/model/node/node.model';
import { Edge } from 'src/app/model/edge/edge.model';
import { Pagerank } from 'src/app/model/pagerank/pagerank.model'

import * as fromRoot from 'src/app/model/reducers';

@Component({
  selector: 'app-graph-page',
  templateUrl: './graph-page.component.html',
  styleUrls: ['./graph-page.component.css']
})
export class GraphPageComponent implements OnInit, AfterViewInit {

  // buttons for adding and removing nodes
  // @ViewChild('ClearGraph', { static: false, read: ElementRef }) clearGraph;
  @ViewChild('ClearPagerank', { static: false, read: ElementRef }) clearPagerank;

  nodes$: Observable<Node[]>;
  edges$: Observable<Edge[]>;
  selectedNodes$: Observable<Node[]>;
  pageranks$: Observable<Pagerank[]>;

  constructor(
    private store: Store<fromRoot.State>,
  ) {
    this.nodes$ = this.store.pipe(select(fromRoot.getVisibleNodes));
    this.edges$ = this.store.pipe(select(fromRoot.getValidEdges));
    this.selectedNodes$ = this.store.pipe(select(fromRoot.getSelectedNodes));
    this.pageranks$ = this.store.pipe(select(fromRoot.getAllPageranks));
  }

  ngOnInit() {
    const initialNode = createNode({
      id: 0,
    });
    this.store.dispatch(new nodeActions.AddNode({ node: initialNode }));
    this.store.dispatch(new nodeActions.LoadNeighborNodes({ from: initialNode }));
  }

  ngAfterViewInit() {
    // fromEvent(this.clearGraph.nativeElement, 'click')
    //   .subscribe(_ => {
    //     this.store.dispatch(new ClearGraph());
    //   });

    // fromEvent(this.clearPagerank.nativeElement, 'click')
    //   .subscribe(_ => {
    //     this.store.dispatch(new ClearPageranks());
    //   });
  }

  onToggleSelection(node: Node) {
    this.store.dispatch(new nodeActions.ToggleNodeSelection({ id: node.id }));
    // this.store.dispatch(new nodeActions.LoadNeighborNodes({ from: node }));
    this.store.dispatch(new AskPageranks({ ids: [node.id] }));
  }
}
