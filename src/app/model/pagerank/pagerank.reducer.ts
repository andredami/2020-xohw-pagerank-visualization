import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Pagerank } from 'src/app/model/pagerank/pagerank.model';
import { PagerankActions, PagerankActionTypes } from 'src/app/model/pagerank/pagerank.actions';

export interface State extends EntityState<Pagerank> {
  // additional entities state properties
  validEntries: (string | number)[];
}

export const adapter: EntityAdapter<Pagerank> = createEntityAdapter<Pagerank>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  validEntries: []
});

export function baseReducer(
  state = initialState,
  action: PagerankActions
): State {
  switch (action.type) {
    case PagerankActionTypes.AddPagerank:
      state = adapter.addOne(action.payload.pagerank, state);
      return {
        ...state,
        validEntries: [action.payload.pagerank.id, ...state.validEntries]
      };

    case PagerankActionTypes.UpsertPagerank:
      state = adapter.upsertOne(action.payload.pagerank, state);
      return {
        ...state,
        validEntries: [action.payload.pagerank.id, ...state.validEntries]
      };

    case PagerankActionTypes.AddPageranks:
      state = adapter.addMany(action.payload.pageranks, state);
      return {
        ...state,
        validEntries: [...action.payload.pageranks.map((p) => p.id), ...state.validEntries]
      };

    case PagerankActionTypes.UpsertPageranks:
      state = adapter.upsertMany(action.payload.pageranks, state);
      return {
        ...state,
        validEntries: [...action.payload.pageranks.map((p) => p.id), ...state.validEntries]
      };

    case PagerankActionTypes.UpdatePagerank:
      state = adapter.updateOne(action.payload.pagerank, state);
      return {
        ...state,
        validEntries: [action.payload.pagerank.id, ...state.validEntries]
      };

    case PagerankActionTypes.UpdatePageranks:
      state = adapter.updateMany(action.payload.pageranks, state);
      return {
        ...state,
        validEntries: [...action.payload.pageranks.map((p) => p.id), ...state.validEntries]
      };

    case PagerankActionTypes.DeletePagerank:
      state = adapter.removeOne(action.payload.id, state);
      return {
        ...state,
        validEntries: state.validEntries.filter(e => e !== action.payload.id)
      };

    case PagerankActionTypes.DeletePageranks:
      state = adapter.removeMany(action.payload.ids, state);
      return {
        ...state,
        validEntries: state.validEntries.filter(e => !(e in action.payload.ids))
      };

    case PagerankActionTypes.LoadPageranks:
      state = adapter.setAll(action.payload.pageranks, state);
      return {
        ...state,
        validEntries: [...action.payload.pageranks.map((p) => p.id), ...state.validEntries]
      };

    case PagerankActionTypes.ClearPageranks:
      state = adapter.removeAll(state);
      return {
        ...state,
        validEntries: []
      };

    default:
      return state;
  }
}

// export const reducer = makeCacheable(baseReducer, 'id');
export const reducer = baseReducer;

export function getValidEntities(state: State) {
  return state.validEntries;
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
