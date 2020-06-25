import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphPageComponent } from './graph-page.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialState as nodeInitialState } from '../../model/node/node.reducer';
import { initialState as edgeInitialState } from '../../model/edge/edge.reducer';

describe('GraphPageComponent', () => {
  let component: GraphPageComponent;
  let fixture: ComponentFixture<GraphPageComponent>;
  let store: MockStore;
  const initialState = {
    node: nodeInitialState,
    edge: edgeInitialState,
  };

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ ],
      providers: [
        provideMockStore({ initialState }),
      ],
      declarations: [ GraphPageComponent ]
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphPageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
