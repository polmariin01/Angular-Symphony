import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LlistaApiService {
  private baseUrl = 'https://api.openopus.org/composer/list/name/';

  constructor(private http: HttpClient) { }

  getData(lletra: string | null) {
    if (lletra !== null) {
      const apiUrl = this.baseUrl + lletra.toLowerCase() + '.json';
      console.log(apiUrl);
      return this.http.get(apiUrl);
    } else {
      console.log('Default link in API');
      return this.http.get('https://api.openopus.org/composer/list/pop.json');
    }
  }
}
