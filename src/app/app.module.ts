import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './model/reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { GraphComponent } from './components/graph/graph.component';
import { GraphPageComponent } from './components/graph-page/graph-page.component';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { GraphEffects } from './services/graph/graph.effects';

import { CacheManagerService } from './services/cache-manager/cache-manager.service';
import { PagerankEffects } from './services/pagerank/pagerank.effects';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    GraphPageComponent,
    SearchBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
        strictStateSerializability: false,
        strictActionSerializability: false,
        strictActionWithinNgZone: false,
        strictActionTypeUniqueness: false,
      },
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    HttpClientModule,
    EffectsModule.forRoot([GraphEffects, PagerankEffects]),
  ],
  providers: [CacheManagerService,
    {
      provide: APP_INITIALIZER,
      useFactory: (m: CacheManagerService) => (() => m.init()),
      deps: [CacheManagerService],
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
