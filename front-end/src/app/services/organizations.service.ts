import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationsService {

  constructor(private http: HttpClient) { }

  async getOrganizations (filters: any = null) {
    let finalFilters: any = {};
    if (filters)
      Object.keys(filters).forEach((element) => {
        if (typeof filters[element] === 'string')
          filters[element] = filters[element].trim();

        if (filters[element] != null && filters[element] != '')
          finalFilters[element] = filters[element];
      });
    return firstValueFrom(
      this.http.get('/api/organizations', { params: finalFilters }).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getOrganization(id: number) {
    return firstValueFrom(
      this.http.get("api/organizations/" + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  submitOrganization(id: number = 0, data: {}) {
    if (id) {
      return firstValueFrom(
        this.http
          .patch("api/organizations/" + id, data)
          .pipe(map((d: any) => d))
      ).catch((e) => false);
    } else {
      return firstValueFrom(
        this.http.post("api/organizations", data).pipe(map((d: any) => d))
      ).catch((e) => false);
    }
  }

  deleteOrganization(id: number) {
    return firstValueFrom(
      this.http.delete("api/organizations/" + id).pipe(map((d: any) => d))
    );
  }
}
