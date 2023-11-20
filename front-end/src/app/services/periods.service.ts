import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class PeriodsService {
  constructor(private http: HttpClient) {}

  async getPeriods(filters: any = null, page: number, limit: number) {
    let finalFilters: any = {};
    if (filters)
      Object.keys(filters).forEach((element) => {
        if (typeof filters[element] === 'string')
          filters[element] = filters[element].trim();

        if (filters[element] != null && filters[element] != '')
          finalFilters[element] = filters[element];
      });
    return firstValueFrom(
      this.http.get(environment.api_url+`/periods?page=${page}&limit=${limit}`, {params: finalFilters}).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getPeriod(id: number) {
    return firstValueFrom(
      this.http.get(environment.api_url+"/periods/" + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  submitPeriod(id: number = 0, data: {}) {
    if (id) {
      return firstValueFrom(
        this.http.patch(environment.api_url+"/periods/" + id, data).pipe(map((d: any) => d))
      ).catch((e) => false);
    } else {
      return firstValueFrom(
        this.http.post(environment.api_url+"/periods", data).pipe(map((d: any) => d))
      ).catch((e) => false);
    }
  }

  deletePeriod(id: number) {
    return firstValueFrom(
      this.http.delete(environment.api_url+"/periods/" + id).pipe(map((d: any) => d))
    );
  }
}
