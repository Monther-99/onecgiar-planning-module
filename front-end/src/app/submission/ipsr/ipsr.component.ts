import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-ipsr",
  templateUrl: "./ipsr.component.html",
  styleUrls: ["./ipsr.component.scss"],
})
export class IpsrComponent implements OnInit {
  ipsrForm: FormGroup<any> = new FormGroup([]);
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ipsrs: any;
  values: any;
  submit() {
    this.ipsrForm.markAllAsTouched();
    this.ipsrForm.updateValueAndValidity();
    if (this.ipsrForm.valid) this.dialogRef.close(this.ipsrForm.value);
  }
  ngOnInit() {
    this.ipsrs = this.data.ipsrs;
    this.values = this.data.values;
    let obj: any = {};
    this.ipsrs.forEach((item: any) => {
      let ipsrValueArr = this.values.length
        ? this.values.filter((d: any) => d.ipsr_id == item.id)
        : [];
      let ipsrValue = ipsrValueArr.length ? ipsrValueArr[0].value : null;
      obj["value-" + item.id] = [ipsrValue];
    });
    this.ipsrForm = this.fb.group({
      ...obj,
      initiative_id: [this.data?.initiative_id, Validators.required],
      
      
    });
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }
}
