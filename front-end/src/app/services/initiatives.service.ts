import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, map } from 'rxjs';

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
      this.http.get('/api/initiatives/full').pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getInitiativesOnly() {
    return firstValueFrom(
      this.http.get('/api/initiatives').pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  getInitiativeUsers(id: number) {
    return firstValueFrom(
      this.http
        .get(`api/initiatives/${id}/roles`, {
        })
        .pipe(map((d) => d))
    );
  }

   // roles
   getInitiativeRoles(initiativeId: number) {
    return this.http
      .get( 'api/initiatives/' + initiativeId + '/roles', {
      })
      .toPromise();
  }

  createNewInitiativeRole(initiativeId: number, role: any): Observable<any>{
    return this.http
      .post<any>(
       'api/initiatives/' + initiativeId + '/roles',
       role
      )
  }

  updateInitiativeRole(initiativeId: number, roleId: number, role: any): Observable<any> {
    return this.http
      .put(
       'api/initiatives/' + initiativeId + '/roles/' + roleId,
       role
      );
  }

  deleteInitiativeRole(initiativeId: number, roleId: number) {
    return this.http
      .delete(
       'api/initiatives/' + initiativeId + '/roles/' + roleId
      )
      .toPromise();
  }
}
