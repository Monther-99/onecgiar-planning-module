import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {
  Observable,
  Subject,
  catchError,
  concat,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
} from "rxjs";
import { InitiativesService } from "src/app/services/initiatives.service";
import { SubmissionService } from "src/app/services/submission.service";

@Component({
  selector: "app-melia",
  templateUrl: "./melia.component.html",
  styleUrls: ["./melia.component.scss"],
})
export class MeliaComponent implements OnInit {
  meliaForm: FormGroup<any> = new FormGroup([]);
  meliaTypes: any = [];
  countries: any = [];
  partners: Observable<any[]>;
  partnersInput = new Subject<string>();
  partnersLoading = false;
  initiatives: any = [];
  results: any = [];
  savedData: any = {};

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private submissionService: SubmissionService,
    private initiativesService: InitiativesService
  ) {
    this.savedData = data.data;
  }

  submit() {
    if (this.meliaForm.valid) this.dialogRef.close(this.meliaForm.value);
  }
  async ngOnInit() {
    this.meliaForm = this.fb.group({
      initiative_id: [this.data.initiative_id, Validators.required],
      wp_id: [this.data.wp.ost_wp.wp_official_code, Validators.required],
      melia_type: [this.savedData?.melia_type],
      methodology: [this.savedData?.methodology],
      experimental: [this.savedData?.experimental],
      questionnaires: [this.savedData?.questionnaires],
      completion_year: [this.savedData?.completion_year],
      management_decisions: [this.savedData?.management_decisions],
      geo_scope: [this.savedData?.geo_scope],
      initiative_countries: [this.savedData?.initiative_countries],
      partners: [this.savedData?.partners, Validators.required],
      other_initiatives: [this.savedData?.other_initiatives],
      co_initiative_countries: [this.savedData?.co_initiative_countries],
      contribution_results: [this.savedData?.contribution_results],
    });
    this.loadPartners();
    this.meliaTypes = await this.submissionService.getMeliaTypes();
    this.countries = await this.submissionService.getCountries();
    this.initiatives = await this.initiativesService.getInitiativesOnly();
    this.results = await this.submissionService.getToc(this.data.initiative_id);
    this.results = this.results.filter((result: any) => {
      if (this.data.wp.ost_wp.wp_official_code == "CROSS") {
        return (
          result.category == "OUTCOME" ||
          (this.data.show_eoi && result.category == "EOI")
        );
      } else {
        return (
          result.category == "OUTCOME" &&
          (result.group == this.data.wp.id ||
            result.wp_id == this.data.wp.ost_wp.wp_official_code)
        );
      }
    });
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  private loadPartners() {
    this.partners = concat(
      of([]), // default items
      this.partnersInput.pipe(
        distinctUntilChanged(),
        tap(() => (this.partnersLoading = true)),
        switchMap((term) =>
          this.submissionService.searchPartners(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.partnersLoading = false))
          )
        )
      )
    );
  }

  compareFn(item: any, selected: any) {
    return item.id === selected.id;
  }

  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }
}
