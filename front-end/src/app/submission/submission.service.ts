import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  constructor(private http: HttpClient) {}

  async get() {
    return firstValueFrom(
      this.http.get('https://toc.mel.cgiar.org/api/toc/cbf435de-b727-425f-a941-68915c869328').pipe(map((d: any) => d))
    ).catch((e) => false);
  }
}
