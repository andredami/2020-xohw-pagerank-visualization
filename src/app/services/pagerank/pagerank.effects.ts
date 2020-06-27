import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { PagerankService } from 'src/app/services/pagerank/pagerank.service';
import { AskPageranks, UpsertPageranks, ErrorPagerank, PagerankActionTypes } from 'src/app/model/pagerank/pagerank.actions';
// import { Pagerank } from 'src/app/model/pagerank/pagerank.model';
import CONFIGURATION from 'src/app/app.config';
import { LoadNeighborNodesFromId } from 'src/app/model/node/node.actions';

@Injectable()
export class PagerankEffects {

  @Effect() getPagerank$ = this.actions$.pipe(
    ofType<AskPageranks>(PagerankActionTypes.AskPageranks),
    concatMap(action => {
      console.log("ask pagerank from " + action.payload.ids);
      return this.pagerankService.getPagerank(action.payload.ids).pipe(
        concatMap(response => {
          const topX = action.payload.top || CONFIGURATION.MAX_PAGERANK_RESULTS;
          response.forEach(r => {
            r.results = new Map(Array.from(r.results.entries()).slice(0, topX));
            r.max_rank =  Math.max(...r.results.values())
            r.min_rank =  Math.min(...r.results.values())
          })
          const nodeActions = []
          response.forEach(r => {
            nodeActions.push(...Array.from(r.results.keys()).map((v: number) => new LoadNeighborNodesFromId({ from: v })))
          })
          return [
            new UpsertPageranks({ pageranks: response }),
            ...nodeActions
          ];
        }),
      );
    }),
    catchError(() => of(new ErrorPagerank({ error: 'Error loading pagerank' })))
  );

  constructor(
    private actions$: Actions,
    private pagerankService: PagerankService
  ) { }
}
