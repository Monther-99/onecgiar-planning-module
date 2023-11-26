import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  constructor(private http: HttpClient) {}
  async markStatus(
    organization_code: string,
    initiative_id: number,
    phase_id: number,
    status: boolean
  ) {
    return firstValueFrom(
      this.http
        .patch(environment.api_url+'/submission/center/status', {
          organization_code,
          initiative_id,
          phase_id,
          status,
        })
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async excel(id: any) {
    return firstValueFrom(
      this.http.get('/api/submission/excel/' + id).pipe(map((d: any) => d))
    );
  }


  async getToc(id: any) {
    return firstValueFrom(
      this.http.get(environment.api_url+'/submission/toc/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getSubmissionsByInitiativeId(id: number, filters: any = null, page: any = null, limit: any = null, withFilters: boolean) {
    if(withFilters == false) {
      return firstValueFrom(
        this.http
          .get(environment.api_url+'/submission/initiative_id/' + id, { params: { withFilters : false} })
          .pipe(map((d: any) => d))
      ).catch((e) => false);
    } else {
      let finalFilters: any = {};
      if (filters)
        Object.keys(filters).forEach((element) => {
          if (typeof filters[element] === 'string')
            filters[element] = filters[element].trim();
  
          if (filters[element] != null && filters[element] != '')
            finalFilters[element] = filters[element];
        });
        return firstValueFrom(
          this.http
            .get(environment.api_url+`/submission/initiative_id/${id}/?page=${page}&limit=${limit}`, { params: finalFilters })
            .pipe(map((d: any) => d))
        ).catch((e) => false);
    }
  }
  

  async getSubmissionsById(id: number) {
    return firstValueFrom(
      this.http.get(environment.api_url+'/submission/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getMeliaByInitiative(id: any) {
    return firstValueFrom(
      this.http.get(environment.api_url+'/melia/initiative/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async getIpsrs() {
    return firstValueFrom(
      this.http.get(environment.api_url+'/ipsr').pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async getIpsrByInitiative(id: any) {
    return firstValueFrom(
      this.http.get(environment.api_url+'/ipsr-value/initiative/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async getCrossByInitiative(id: any) {
    return firstValueFrom(
      this.http
        .get(environment.api_url+'/cross-cutting/initiative/' + id)
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async newMelia(data: any) {
    return firstValueFrom(
      this.http.post(environment.api_url+'/melia', data).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async saveIPSR(data: any) {
    return firstValueFrom(
      this.http.post(environment.api_url+'/ipsr-value', data).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getMeliaById(id: any) {
    return firstValueFrom(
      this.http.get(environment.api_url+'/melia/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async updateMelia(id: number, data: any) {
    return firstValueFrom(
      this.http.patch(environment.api_url+'/melia/' + id, data).pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async deleteMelia(id: number) {
    return firstValueFrom(
      this.http.delete(environment.api_url+'/melia/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getCrossById(id: any) {
    return firstValueFrom(
      this.http.get(environment.api_url+'/cross-cutting/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async newCross(data: any) {
    return firstValueFrom(
      this.http.post(environment.api_url+'/cross-cutting', data).pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async updateCross(id: number, data: any) {
    return firstValueFrom(
      this.http.patch(environment.api_url+'/cross-cutting/' + id, data).pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async deleteCross(id: number) {
    return firstValueFrom(
      this.http.delete(environment.api_url+'/cross-cutting/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getInitiative(id: number) {
    return firstValueFrom(
      this.http.get(environment.api_url+'/initiatives/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getOrganizations() {
    return firstValueFrom(
      this.http.get(environment.api_url+'/organizations').pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getPeriods(phase_id: number) {
    return firstValueFrom(
      this.http.get(environment.api_url+'/periods/phase/' + phase_id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async submit(id: number, data: any) {
    return firstValueFrom(
      this.http
        .post(environment.api_url+'/submission/save/' + id, data)
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getSavedData(id: number) {
    return firstValueFrom(
      this.http.get(environment.api_url+'/submission/save/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async saveResultValues(id: number, data: any) {
    return firstValueFrom(
      this.http
        .post(environment.api_url+'/submission/save_result_values/' + id, data)
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }
  async saveResultValue(id: number, data: any) {
    return firstValueFrom(
      this.http
        .post(environment.api_url+'/submission/save_result_value/' + id, data)
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async updateSubmissionStatus(id: number, data: any) {
    return firstValueFrom(
      this.http
        .patch(environment.api_url+'/submission/status/' + id, data)
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async saveWpBudget(id: number, data: any) {
    return firstValueFrom(
      this.http
        .post(environment.api_url+'/submission/save_wp_budget/' + id, data)
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getWpBudgets(id: number) {
    return firstValueFrom(
      this.http.get(environment.api_url+'/submission/wp_budgets/' + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getBudgets(id: number) {
    return firstValueFrom(
      this.http
        .get(environment.api_url+'/submission/submission_budgets/' + id)
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getMeliaTypes() {
    return firstValueFrom(
      this.http.get(environment.api_url+'/melia/types').pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getRegions() {
    return firstValueFrom(
      this.http.get(environment.api_url+'/organizations/regions').pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getCountriesRegions(codes: number[]) {
    return firstValueFrom(
      this.http
        .post(environment.api_url+'/organizations/countries-regions/', codes)
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getCountries() {
    return firstValueFrom(
      this.http.get(environment.api_url+'/organizations/countries').pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getPartners() {
    return firstValueFrom(
      this.http.get(environment.api_url+'/organizations/partners').pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  searchPartners(term: string): Observable<any[]> {
    return this.http
      .get(environment.api_url+'/organizations/partners/' + term)
      .pipe(map((d: any) => d));
  }
}
