import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InitiativesService {
  constructor(private http: HttpClient) {}

  async getInitiative(id: number) {
    return firstValueFrom(
      this.http.get('/api/initiatives/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async getInitiatives() {
    return firstValueFrom(
      this.http.get('/api/initiatives').pipe(map((d: any) => d))
    ).catch((e) => false);
  }
}
