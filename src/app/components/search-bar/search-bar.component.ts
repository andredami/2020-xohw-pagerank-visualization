import { Component, ElementRef, AfterViewInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import * as fromRoot from 'src/app/model/reducers';
import { AskPageranks } from 'src/app/model/pagerank/pagerank.actions';
import { Store } from '@ngrx/store';
import { Pagerank } from 'src/app/model/pagerank/pagerank.model';
import * as nodeActions from 'src/app/model/node/node.actions';


@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements AfterViewInit {

  @ViewChild('input', { read: false, static: false }) input: ElementRef;
  @Input() pageranks: Pagerank[] = [];
  @Output() search = new EventEmitter<number[]>();

  DEBOUNCE_TIME = 3000 /* ms */;

  constructor(private store: Store<fromRoot.State>) { }

  ngAfterViewInit() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged(),
        tap((_: KeyboardEvent) => {
          const value = parseValue(this.input.nativeElement.value);
          const request = value.filter(id => (this.storedIds.indexOf(id) === -1));
          if (request.length) {
            this.store.dispatch(new nodeActions.ToggleNodeSelection({ id: value[0] }));
            this.store.dispatch(new AskPageranks({ ids: request }));
          }
        })
      )
      .subscribe();
  }

  get storedIds() {
    return this.pageranks.map((pr: Pagerank) => Number(pr.id));
  }
}

const parseValue = (value): number[] => value === '' ? undefined : value.split(',').map(Number).filter(e => !isNaN(e));
