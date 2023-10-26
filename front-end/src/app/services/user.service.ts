import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, firstValueFrom, map } from "rxjs";

import jwt_decode from "jwt-decode";
@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpClient) {}






  

  async getUsers(filters: any = null, page: number, limit: number) {
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
        .get(`api/users?page=${page}&limit=${limit}`, {
          params: finalFilters,
        })
        .pipe(map((d) => d))
    ).catch((e) => false);
  }
  async getUsersForTeamMember(filters: any = null) {
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
        .get(`api/users`, {
          params: finalFilters,
        })
        .pipe(map((d) => d))
    ).catch((e) => false);
  }

  // getUsersForTeamMember(filters: any = null): Observable<any> {
  //   let finalFilters: any = {};
  //   if (filters)
  //     Object.keys(filters).forEach((element) => {
  //       if (typeof filters[element] === "string")
  //         filters[element] = filters[element].trim();

  //       if (filters[element] != null && filters[element] != "")
  //         finalFilters[element] = filters[element];
  //     });
  //   return this.http.get(`api/users`, {
  //     params: finalFilters,
  //   });
  // }

  // getUsersForTeamMembera(filters: any = null): Observable<any> {
  //   let finalFilters: any = {};
  //   if (filters)
  //     Object.keys(filters).forEach((element) => {
  //       if (typeof filters[element] === "string")
  //         filters[element] = filters[element].trim();

  //       if (filters[element] != null && filters[element] != "")
  //         finalFilters[element] = filters[element];
  //     });
  //   return this.http.get(this.backend_url + `/users`, {
  //     params: finalFilters,
  //     headers: this.headers,
  //   });
  // }

  // this.http
  // .get(`api/users`, {
  //   params: finalFilters,
  // }

  // async addUser(data: any) {
  //   return firstValueFrom(
  //     this.http
  //       .post(this.backend_url + `/users`, data, {
  //         headers: this.headers,
  //       })
  //       .pipe(map((d) => d))
  //   );
  // }

  // async addUser(data: any) {
  //   return firstValueFrom(
  //     this.http
  //       .post(`api/users`, data, {
  //       })
  //       .pipe(map((d) => d))
  //   ).catch((e) => false);
  // }

  // async updateUser(data: any) {
  //   return firstValueFrom(
  //     this.http
  //       .put(`api/users`, data, {
  //       })
  //       .pipe(map((d) => d))
  //   ).catch((e) => false);
  // }
  // async deleteUser(id: any) {
  //   return firstValueFrom(
  //     this.http
  //       .delete(`api/users/${id}`, {

  //       })
  //       .pipe(map((d) => d))
  //   ).catch((e) => false);
  // }

  getLogedInUser(): any {
    if (localStorage.getItem("access_token") as string)
      return jwt_decode(localStorage.getItem("access_token") as string);
    else return false;
  }

  async exportUsers() {
    const data: any = await firstValueFrom(
      this.http
        .get("api/users/export/all", {
          responseType: "blob",
        })
        .pipe(map((d: Blob) => d))
    );
  }

  async getAllUsers(filters: any = null, page: number, limit: number) {
    let finalFilters: any = {};
    if (filters)
      Object.keys(filters).forEach((element) => {
        if (typeof filters[element] === 'string')
          filters[element] = filters[element].trim();

        if (filters[element] != null && filters[element] != '')
          finalFilters[element] = filters[element];
      });
    return firstValueFrom(
      this.http.get(`api/users?page=${page}&limit=${limit}`, {params: finalFilters}).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getUser(id: number) {
    return firstValueFrom(
      this.http.get("api/users/" + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  submitUser(id: number = 0, data: {}) {
    if (id) {
      return firstValueFrom(
        this.http.patch("api/users/" + id, data).pipe(map((d: any) => d))
      ).catch((e) => false);
    } else {
      return firstValueFrom(
        this.http.post("api/users", data).pipe(map((d: any) => d))
      ).catch((e) => false);
    }
  }

  deleteUser(id: number) {
    return firstValueFrom(
      this.http.delete("api/users/" + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }
}
