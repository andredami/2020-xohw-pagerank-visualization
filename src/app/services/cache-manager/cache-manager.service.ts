import { Injectable } from '@angular/core';
import { interval, from, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/model/reducers';
import { mergeMap, distinct, toArray, skip, map, tap } from 'rxjs/operators';
import { DeletePageranks } from 'src/app/model/pagerank/pagerank.actions';

const PERIOD = 1 * 1000 /* ms */;
const tick = interval(PERIOD);
const MAX_ENTRIES = 8;

@Injectable({
  providedIn: 'root'
})
export class CacheManagerService {

  constructor(private store: Store<fromRoot.State>) {
  }

  init(): Subscription {
    console.log('Starting Cache Manager Service');
    return tick.subscribe(_ => {
      this.store.select(fromRoot.getValidEntries).pipe(
        mergeMap(ve => from(ve)),
        distinct(),
        skip(MAX_ENTRIES),
        map(r => String(r)),
        toArray(),
        tap(_ => console.log('cleaning cache'))
      ).subscribe(
        result => new DeletePageranks({ ids: result })
      );
    });
  }
}
