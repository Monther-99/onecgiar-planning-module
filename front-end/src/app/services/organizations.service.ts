import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OrganizationsService {
  constructor(private http: HttpClient) {}

  async getOrganizations(filters: any = null) {
    let finalFilters: any = {};
    if (filters)
      Object.keys(filters).forEach((element) => {
        if (typeof filters[element] === "string")
          filters[element] = filters[element].trim();

        if (filters[element] != null && filters[element] != "")
          finalFilters[element] = filters[element];
      });
    return firstValueFrom(
      this.http
        .get("/api/organizations", { params: finalFilters })
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getOrganization(code: string) {
    return firstValueFrom(
      this.http.get("api/organizations/" + code).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  submitOrganization(code: string = "0", data: {}) {
    if (code != "0") {
      return firstValueFrom(
        this.http
          .patch("api/organizations/" + code, data)
          .pipe(map((d: any) => d))
      );
    } else {
      return firstValueFrom(
        this.http.post("api/organizations", data).pipe(map((d: any) => d))
      );
    }
  }

  deleteOrganization(id: number) {
    return firstValueFrom(
      this.http.delete("api/organizations/" + id).pipe(map((d: any) => d))
    );
  }
}
