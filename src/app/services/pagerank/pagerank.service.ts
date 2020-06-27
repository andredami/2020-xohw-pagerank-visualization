import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Pagerank, Rank } from 'src/app/model/pagerank/pagerank.model';

export const TEST = 'vertices[]=1&vertices[]=10';
const backendUrl = "https://xohw-approximate-pagerank.herokuapp.com/compute?limit=20&";

@Injectable({
  providedIn: 'root'
})
export class PagerankService {

  constructor(private http: HttpClient) { }

  /** get pagerank from backend */
  public getPagerank(ids: number[]): Observable<Pagerank[]> {
    if (ids.length > 8) { console.error('too many vertices'); return; }
    const params = ids.map(id => `vertices[]=${id}`).join('&');
    return this.http.get(backendUrl + params).pipe(
      map((httpResponseBody: { request: string[], response: { id: string, results: Rank[] }[] }) => {
        return httpResponseBody.response.map((pagerank) => (
          {
          id: Number(pagerank.id),
          // results: pagerank.results.map((rank) => ({
          //   vertex: Number(rank.vertex),
          //   value: rank.value
          // })),
          results: new Map(pagerank.results.map(r => [Number(r.vertex), Number(r.value)])),
          min_rank: Math.min(...pagerank.results.map(r => r.value)),
          max_rank: Math.max(...pagerank.results.map(r => r.value))
        }));
      }), catchError(error => {
        return throwError('Something went wrong: ' + error);
      }));
  }
}
