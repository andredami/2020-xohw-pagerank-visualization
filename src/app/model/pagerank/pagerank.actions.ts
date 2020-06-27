import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Pagerank } from 'src/app/model/pagerank/pagerank.model';

export enum PagerankActionTypes {
  AskPagerank = '[Pagerank] Ask Pagerank',
  AskPageranks = '[Pagerank] Ask Pageranks',
  LoadPageranks = '[Pagerank] Load Pageranks',
  AddPagerank = '[Pagerank] Add Pagerank',
  UpsertPagerank = '[Pagerank] Upsert Pagerank',
  AddPageranks = '[Pagerank] Add Pageranks',
  UpsertPageranks = '[Pagerank] Upsert Pageranks',
  UpdatePagerank = '[Pagerank] Update Pagerank',
  UpdatePageranks = '[Pagerank] Update Pageranks',
  DeletePagerank = '[Pagerank] Delete Pagerank',
  DeletePageranks = '[Pagerank] Delete Pageranks',
  ClearPageranks = '[Pagerank] Clear Pageranks',
  ErrorPagerank = '[Pagerank] Error Pagerank',
}

export class AskPagerank implements Action {
  readonly type = PagerankActionTypes.AskPagerank;

  constructor(public payload: { ids: number }) { }
}

export class AskPageranks implements Action {
  readonly type = PagerankActionTypes.AskPageranks;

  constructor(public payload: { ids: number[], top?: number }) { }
}

export class LoadPageranks implements Action {
  readonly type = PagerankActionTypes.LoadPageranks;

  constructor(public payload: { pageranks: Pagerank[] }) { }
}

export class AddPagerank implements Action {
  readonly type = PagerankActionTypes.AddPagerank;

  constructor(public payload: { pagerank: Pagerank }) { }
}

export class UpsertPagerank implements Action {
  readonly type = PagerankActionTypes.UpsertPagerank;

  constructor(public payload: { pagerank: Pagerank }) { }
}

export class AddPageranks implements Action {
  readonly type = PagerankActionTypes.AddPageranks;

  constructor(public payload: { pageranks: Pagerank[] }) { }
}

export class UpsertPageranks implements Action {
  readonly type = PagerankActionTypes.UpsertPageranks;

  constructor(public payload: { pageranks: Pagerank[] }) { }
}

export class UpdatePagerank implements Action {
  readonly type = PagerankActionTypes.UpdatePagerank;

  constructor(public payload: { pagerank: Update<Pagerank> }) { }
}

export class UpdatePageranks implements Action {
  readonly type = PagerankActionTypes.UpdatePageranks;

  constructor(public payload: { pageranks: Update<Pagerank>[] }) { }
}

export class DeletePagerank implements Action {
  readonly type = PagerankActionTypes.DeletePagerank;

  constructor(public payload: { id: string }) { }
}

export class DeletePageranks implements Action {
  readonly type = PagerankActionTypes.DeletePageranks;

  constructor(public payload: { ids: string[] }) { }
}

export class ClearPageranks implements Action {
  readonly type = PagerankActionTypes.ClearPageranks;
}

export class ErrorPagerank implements Action {
  readonly type = PagerankActionTypes.ErrorPagerank;

  constructor(public payload: { error: string }) { }
}

export type PagerankActions
  = AskPagerank
  | AskPageranks
  | LoadPageranks
  | AddPagerank
  | UpsertPagerank
  | AddPageranks
  | UpsertPageranks
  | UpdatePagerank
  | UpdatePageranks
  | DeletePagerank
  | DeletePageranks
  | ClearPageranks
  | ErrorPagerank;
