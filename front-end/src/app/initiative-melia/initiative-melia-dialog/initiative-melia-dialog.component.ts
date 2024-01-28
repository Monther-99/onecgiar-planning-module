import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { AnticipatedYearService } from 'src/app/services/anticipated-year.service';
import { InitiativesService } from 'src/app/services/initiatives.service';
import { MeliaTypeService } from 'src/app/services/melia-type.service';
import { SubmissionService } from 'src/app/services/submission.service';
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';
import { MatRadioChange } from '@angular/material/radio';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-initiative-melia-dialog',
  templateUrl: './initiative-melia-dialog.component.html',
  styleUrls: ['./initiative-melia-dialog.component.scss'],
  providers: [
    provideMomentDateAdapter(MY_FORMATS),
  ],
})
export class InitiativeMeliaDialogComponent implements OnInit {
  meliaForm: any;
  meliaTypes: any[] = [];
  confirmation: any = '';
  initiatives: any = [];
  // AnticipatedYear: any;
  initiativeMelias: any = [];

  constructor(
    public fb: FormBuilder,
    private dialogRef: MatDialogRef<InitiativeMeliaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any = {},
    private meliaTypeService: MeliaTypeService,
    private submissionService: SubmissionService,
    private initiativesService: InitiativesService,
    // private anticipatedYearService: AnticipatedYearService
  ) {}

  async ngOnInit() {
    if(this.data.question)
      this.requierdOtherInitiatives = true;
    else
      this.requierdOtherInitiatives = false;

    this.populateMeliaForm();
  }

  async populateMeliaForm() {
    this.meliaForm = this.fb.group({
      initiative_id: [this.data.initiative_id, Validators.required],
      melia_type_id: [this.data?.melia_type_id],
      methodology: [this.data?.methodology],
      experimental: [this.data?.experimental],
      questionnaires: [this.data?.questionnaires],
      completion_year: [this.data?.completion_year, Validators.required],
      management_decisions: [this.data?.management_decisions],
      other_initiatives: [this.data?.other_initiatives],
      question: [this.data?.question, Validators.required],
    });
    this.meliaTypes = await this.submissionService.getMeliaTypes();
    this.initiativeMelias = await this.meliaTypeService.getInitiativeMelias(
      this.data.initiative_id,
      null
    );
    const existTypesIds = this.initiativeMelias.map((d: any) => d.meliaType.id);
    this.meliaTypes = this.meliaTypes.filter(
      (d: any) =>
        !existTypesIds.includes(d.id) || d.id == this.data?.melia_type_id
    );
    this.initiatives = await this.initiativesService.getInitiativesOnly();
    // this.AnticipatedYear =
    //   await this.anticipatedYearService.getAnticipatedYear();
    // this.AnticipatedYear = this.AnticipatedYear.filter((d: any) => {
    //   return d.phase?.active == true;
    // });
  }

  showerror: boolean = false;
  submit() {
    this.meliaForm.markAllAsTouched();
    this.meliaForm.updateValueAndValidity();
    if (this.meliaForm.valid) {
      this.showerror = false;
      this.dialogRef.close({
        // role: this.data.role,
        formValue: this.meliaForm.value,
      });
    } else {
      this.showerror = true;
    }
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

  compareId(item: any, selected: any) {
    return item.id === selected.id;
  }

  onToppingRemoved(initiative: any) {
    const toppings = this.meliaForm?.value?.other_initiatives as any[];
    this.removeFirst(toppings, initiative);
    this.meliaForm.controls?.['other_initiatives'].setValue(toppings); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  chosenYearHandler(normalizedYear: moment.Moment, dp: MatDatepicker<moment.Moment>) {
    const controlDate = this?.meliaForm?.get('completion_year');
    const ctrlValue = null ?? moment();
    ctrlValue.year(normalizedYear.year());
    controlDate.setValue(ctrlValue);
    dp.close();    
  }

 requierdOtherInitiatives:Boolean;
  radioChange(event: MatRadioChange) {
    const control = this.meliaForm.get('other_initiatives');
    if(event.value == true) {
      this.requierdOtherInitiatives = true;
      control.addValidators(Validators.required);
    } else {
      control.value = [];
      this.requierdOtherInitiatives = false;
      control.clearValidators();  
      control.updateValueAndValidity();
    }
  }
}
