import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, count } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LlistaApiService {
  //private baseUrl = 'https://api.openopus.org/composer/list/name/';

  constructor(private http: HttpClient) { }

  //Get data from the composers api
  getData(lletra: string | null) {
    if (lletra !== null) {
      const apiUrl = 'https://api.openopus.org/composer/list/name/' + lletra.toLowerCase() + '.json';
      //console.log(apiUrl);
      return this.http.get(apiUrl);
    } else {
      //console.log('Default link in API');
      return this.http.get('https://api.openopus.org/composer/list/pop.json');
    }
  }

  generateInteraction(id: string | null) : Observable<any> {
//      const countingApiUrl = 'http://localhost:8000/composer/' + id + '/count/';
//      http://localhost:8000/composer/1/get/
    const countingApiUrl = 'http://127.0.0.1:8000/composer/' + id + '/count/';
    //console.log(countingApiUrl);
    return this.http.post(countingApiUrl, {});
  }

  getComposerData(id: string | null) : Observable<any> {
    const countingApiUrl = 'http://127.0.0.1:8000/composer/' + id + '/get/';
    //console.log(countingApiUrl);
    return this.http.get(countingApiUrl);
  }

  getWorks(id: string): Observable<any> {
    const apiUrl = 'https://api.openopus.org/work/list/composer/' + id + '/genre/Recommended.json';
    //console.log("GET WORKS - ", apiUrl);
    return this.http.get(apiUrl);
  }
}
