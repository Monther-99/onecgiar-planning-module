import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PhasesService {
  constructor(private http: HttpClient) {}

  async getPhases() {
    return firstValueFrom(
      this.http.get("api/phases").pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getPhase(id: number) {
    return firstValueFrom(
      this.http.get("api/phases/" + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  submitPhase(id: number = 0, data: {}) {
    if (id) {
      return firstValueFrom(
        this.http.patch("api/phases/" + id, data).pipe(map((d: any) => d))
      ).catch((e) => false);
    } else {
      return firstValueFrom(
        this.http.post("api/phases", data).pipe(map((d: any) => d))
      ).catch((e) => false);
    }
  }

  deletePhase(id: number) {
    return firstValueFrom(
      this.http.delete("api/phases/" + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  getTocPhases() {
    return firstValueFrom(
      this.http
        .get("https://toc.loc.codeobia.com/api/phases")
        .pipe(map((d: any) => d.data))
    ).catch((e) => false);
  }

  activatePhase(id: number) {
    return firstValueFrom(
      this.http.get("api/phases/activate/" + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  deactivatePhase(id: number) {
    return firstValueFrom(
      this.http.get("api/phases/deactivate/" + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  getActivePhase() {
    return firstValueFrom(
      this.http.get("/api/phases/active").pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  getInitiatives(phase_id: number) {
    return firstValueFrom(
      this.http
        .get("api/phases/" + phase_id + "/initiatives")
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  assignPhaseInitOrgs(data: any) {
    return firstValueFrom(
      this.http.post("api/phases/assign-orgs", data).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  getAssignedOrgs(phase_id: number, initiative_id: number) {
    return firstValueFrom(
      this.http
        .get("api/phases/assigned-orgs/" + phase_id + "/" + initiative_id)
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }
}
