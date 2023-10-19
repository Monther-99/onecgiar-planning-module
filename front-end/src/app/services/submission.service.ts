import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  constructor(private http: HttpClient) {}
  async markStatus(
    organization_id: number,
    initiative_id: number,
    status: boolean
  ) {
    return firstValueFrom(
      this.http
        .patch('/api/submission/center/status', {
          organization_id,
          initiative_id,
          status,
        })
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async getToc(id: any) {
    return firstValueFrom(
      this.http.get('/api/submission/toc/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async getSubmissionsByInitiativeId(id: number) {
    return firstValueFrom(
      this.http
        .get('/api/submission/initiative_id/' + id)
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getSubmissionsById(id: number) {
    return firstValueFrom(
      this.http.get('/api/submission/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getMeliaByInitiative(id: any) {
    return firstValueFrom(
      this.http.get('/api/melia/initiative/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async getIpsrs() {
    return firstValueFrom(
      this.http.get('/api/ipsr').pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async getIpsrByInitiative(id: any) {
    return firstValueFrom(
      this.http.get('/api/ipsr-value/initiative/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async getCrossByInitiative(id: any) {
    return firstValueFrom(
      this.http
        .get('/api/cross-cutting/initiative/' + id)
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async newMelia(data: any) {
    return firstValueFrom(
      this.http.post('/api/melia', data).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async saveIPSR(data: any) {
    return firstValueFrom(
      this.http.post('/api/ipsr-value', data).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getMeliaById(id: any) {
    return firstValueFrom(
      this.http.get('/api/melia/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async updateMelia(id: number, data: any) {
    return firstValueFrom(
      this.http.patch('/api/melia/' + id, data).pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async deleteMelia(id: number) {
    return firstValueFrom(
      this.http.delete('/api/melia/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getCrossById(id: any) {
    return firstValueFrom(
      this.http.get('/api/cross-cutting/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async newCross(data: any) {
    return firstValueFrom(
      this.http.post('/api/cross-cutting', data).pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async updateCross(id: number, data: any) {
    return firstValueFrom(
      this.http.patch('/api/cross-cutting/' + id, data).pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async deleteCross(id: number) {
    return firstValueFrom(
      this.http.delete('/api/cross-cutting/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getInitiative(id: number) {
    return firstValueFrom(
      this.http.get('/api/initiatives/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getOrganizations() {
    return firstValueFrom(
      this.http.get('/api/organizations').pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getPeriods(phase_id: number) {
    return firstValueFrom(
      this.http.get('/api/periods/phase/' + phase_id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async submit(id: number, data: any) {
    return firstValueFrom(
      this.http
        .post('/api/submission/save/' + id, data)
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getSavedData(id: number) {
    return firstValueFrom(
      this.http.get('/api/submission/save/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async saveResultValues(id: number, data: any) {
    return firstValueFrom(
      this.http
        .post('/api/submission/save_result_values/' + id, data)
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async saveResultValue(id: number, data: any) {
    return firstValueFrom(
      this.http
        .post('/api/submission/save_result_value/' + id, data)
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async updateSubmissionStatus(id: number, data: any) {
    return firstValueFrom(
      this.http
        .patch('/api/submission/status/' + id, data)
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async saveWpBudget(id: number, data: any) {
    return firstValueFrom(
      this.http
        .post('/api/submission/save_wp_budget/' + id, data)
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getWpBudgets(id: number) {
    return firstValueFrom(
      this.http.get('/api/submission/wp_budgets/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getBudgets(id: number) {
    return firstValueFrom(
      this.http
        .get('/api/submission/submission_budgets/' + id)
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getMeliaTypes() {
    return firstValueFrom(
      this.http.get('/api/melia/types').pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getCountries() {
    return firstValueFrom(
      this.http.get('/api/organizations/countries').pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getPartners() {
    return firstValueFrom(
      this.http.get('/api/organizations/partners').pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  searchPartners(term: string): Observable<any[]> {
    return this.http
      .get('/api/organizations/partners/' + term)
      .pipe(map((d: any) => d));
  }
}
