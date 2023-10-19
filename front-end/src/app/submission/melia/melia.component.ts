import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Observable,
  Subject,
  catchError,
  concat,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { SubmissionService } from 'src/app/services/submission.service';

@Component({
  selector: 'app-melia',
  templateUrl: './melia.component.html',
  styleUrls: ['./melia.component.scss'],
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

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private submissionService: SubmissionService,
    private initiativesService: InitiativesService
  ) {}

  submit() {
    console.log(this.meliaForm.value);
    if (this.meliaForm.valid) this.dialogRef.close(this.meliaForm.value);
  }
  async ngOnInit() {
    this.meliaForm = this.fb.group({
      initiative_id: [this.data?.initiative_id, Validators.required],
      wp_id: [this.data?.wp_id, Validators.required],
      melia_type: [this.data?.melia_type],
      methodology: [this.data?.methodology],
      experimental: [this.data?.experimental],
      questionnaires: [this.data?.questionnaires],
      completion_year: [this.data?.completion_year],
      management_decisions: [this.data?.management_decisions],
      geo_scope: [this.data?.geo_scope],
      initiative_countries: [this.data?.initiative_countries],
      partners: [this.data?.partners],
      other_initiatives: [this.data?.other_initiatives],
      co_initiative_countries: [this.data?.co_initiative_countries],
      contribution_results: [this.data?.contribution_results],
    });
    this.loadPartners();
    this.meliaTypes = await this.submissionService.getMeliaTypes();
    this.countries = await this.submissionService.getCountries();
    this.initiatives = await this.initiativesService.getInitiativesOnly();
    this.results = await this.submissionService.getToc(
      this.data?.initiative_id
    );
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
}
