import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationsService {

  constructor(private http: HttpClient) { }

  async getOrganizations () {
    return firstValueFrom(
      this.http.get('/api/organizations').pipe(map((d: any) => d))
    ).catch((e) => false);
  }
}
