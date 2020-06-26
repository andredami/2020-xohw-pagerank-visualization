/**
 * Contributor: Gabriele Bonzi <gabriele.bonzi@mail.polimi.it>
 */

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { GraphService } from './graph.service';
import { NodeActionTypes, LoadNeighborNodes, UpsertNodes, LoadNeighborNodesError, ShowNode } from 'src/app/model/node/node.actions';
import { concatMap, catchError } from 'rxjs/operators';
import { UpsertEdges } from 'src/app/model/edge/edge.actions';
import { of } from 'rxjs';
import { CONFIGURATION } from 'src/app/app.config';



@Injectable()
export class GraphEffects {



  constructor(
    private actions$: Actions,
    private graph: GraphService,
  ) {}

  @Effect() retrieveNeighbors = this.actions$.pipe(
    ofType<LoadNeighborNodes>(NodeActionTypes.LoadNeighborNodes),
    concatMap(action => {
      return this.graph.retrieveNeighbors(Number(action.payload.from.id)).pipe(
        concatMap(response => {
          const nodeAction = new UpsertNodes({
            nodes: response.nodes,
          });
          const edgeAction = new UpsertEdges({
            edges: response.edges
          });
          const sourceShowAction = new ShowNode({ node: action.payload.from });
          const showActions =
            Array
              .from({length: CONFIGURATION.MAX_NEIGHBORS}, () => Math.floor(Math.random() * nodeAction.payload.nodes.length))
              .map((id) => nodeAction.payload.nodes[id])
              .map((n) => new ShowNode({ node: n }));
          return [nodeAction, edgeAction, sourceShowAction, ...showActions];
        }),
      );
    }),
    catchError(error => of(new LoadNeighborNodesError(error))),
  );

}
