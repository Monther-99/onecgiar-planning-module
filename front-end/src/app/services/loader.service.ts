import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LoaderService {
  private loading: boolean = false;
  message: string = '';

  constructor() {}

  setLoading(loading: boolean, message: string = "") {
    this.loading = loading;
    this.message = message;
  }

  getLoading(): boolean {
    return this.loading;
  }
}
