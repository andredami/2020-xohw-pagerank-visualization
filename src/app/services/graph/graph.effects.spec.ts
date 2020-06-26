import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { GraphEffects } from './graph.effects';

describe('GraphEffects', () => {
  const actions$: Observable<any>;
  let effects: GraphEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GraphEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(GraphEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
