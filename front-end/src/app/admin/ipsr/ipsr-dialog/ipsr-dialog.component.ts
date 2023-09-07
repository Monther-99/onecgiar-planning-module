import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { IpsrService } from "src/app/services/ipsr.service";

export interface DialogData {
  id: number;
}

@Component({
  selector: "app-ipsr-dialog",
  templateUrl: "./ipsr-dialog.component.html",
  styleUrls: ["./ipsr-dialog.component.scss"],
})
export class IpsrDialogComponent implements OnInit {
  ipsrId: number = 0;
  ipsrForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<IpsrDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private ipsrService: IpsrService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {
    this.ipsrId = data.id;
  }

  ngOnInit() {
    this.formInit();
  }

  private async formInit() {
    this.ipsrForm = this.fb.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
    });
    if (this.ipsrId) {
      let { id, ...ipsrValues } = await this.ipsrService.getIpsr(this.ipsrId);
      this.ipsrForm.setValue({
        ...ipsrValues,
      });
    }
  }

  async submit() {
    if (this.ipsrForm.valid) {
      await this.ipsrService.submitIpsr(this.ipsrId, this.ipsrForm.value);
      this.toast.success("IPSR item saved successfully");
      this.dialogRef.close({ submitted: true });
    }
  }
}
