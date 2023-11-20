import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom, map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class IpsrService {
  constructor(private http: HttpClient) {}

  async getIpsrs(filters: any = null) {
    let finalFilters: any = {};
    if (filters)
      Object.keys(filters).forEach((element) => {
        if (typeof filters[element] === 'string')
          filters[element] = filters[element].trim();

        if (filters[element] != null && filters[element] != '')
          finalFilters[element] = filters[element];
      });
    return firstValueFrom(
      this.http.get(environment.api_url+"/ipsr", { params: finalFilters }).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getIpsr(id: number) {
    return firstValueFrom(
      this.http.get(environment.api_url+"/ipsr/" + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  submitIpsr(id: number = 0, data: {}) {
    if (id) {
      return firstValueFrom(
        this.http.patch(environment.api_url+"/ipsr/" + id, data).pipe(map((d: any) => d))
      ).catch((e) => false);
    } else {
      return firstValueFrom(
        this.http.post(environment.api_url+"/ipsr", data).pipe(map((d: any) => d))
      ).catch((e) => false);
    }
  }

  deleteIpsr(id: number) {
    return firstValueFrom(
      this.http.delete(environment.api_url+"/ipsr/" + id).pipe(map((d: any) => d))
    );
  }
}
