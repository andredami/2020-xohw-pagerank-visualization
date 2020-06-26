/**
 * Contributor: Gabriele Bonzi <gabriele.bonzi@mail.polimi.it>
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Subgraph } from 'src/app/model/subgraph/subgraph';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { createNode } from 'src/app/model/node/node.model';

const RESOURCES = {
  NEIGHBORS: {
    RESOURCE_NAME: 'bfs',
    PARAMS: {
      NODE: 'node',
      DEPTH: 'depth'
    },
  },
};

interface Neighbors {
  nodes: Node[];
  links: Edge[];
}

interface Node {
  id: number;
  linkCount?: number;
}

interface Edge {
  source: Node;
  target: Node;
}

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  constructor(private http: HttpClient) { }

  public retrieveNeighbors(fromId: number, depth: number = 0): Observable<Subgraph> {
    const url =
      `${environment.serviceEndpoints.graph}/${RESOURCES.NEIGHBORS.RESOURCE_NAME}?${RESOURCES.NEIGHBORS.PARAMS.NODE}=${fromId}&${RESOURCES.NEIGHBORS.PARAMS.DEPTH}=${depth}`;
    return this.http.get(url).pipe(
      map((res: Neighbors) => ({
          nodes: res.nodes.map(({id, ...rest}) => (createNode({
            id: id,
            ...rest,
          }))),
          edges: res.links.map(link => ({
            source: link.source.id,
            target: link.target.id,
            id: this.generateEdgeId(link.source.id, link.target.id),
          }))
        }),
        catchError(error => {
          return throwError(`Unable to retrieve neighbors of ${fromId} at maximum depth of ${depth}: ${error}`);
        }),
      )
    );
  }

  private generateEdgeId(source: number, target: number): number {
    return source * MAX_DIGITS + target;
  }
}

const MAX_DIGITS: number = Math.ceil(Math.log10(Number.MAX_SAFE_INTEGER));
