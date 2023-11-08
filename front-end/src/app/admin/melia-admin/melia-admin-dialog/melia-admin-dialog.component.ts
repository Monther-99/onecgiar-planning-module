import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { MeliaTypeService } from "src/app/services/melia-type.service";
export interface DialogData {
  id: number;
}
@Component({
  selector: "app-melia-admin-dialog",
  templateUrl: "./melia-admin-dialog.component.html",
  styleUrls: ["./melia-admin-dialog.component.scss"],
})
export class MeliaAdminDialogComponent {
  meliaId: number = 0;
  meliaTypeForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<MeliaAdminDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private MeliaTypeService: MeliaTypeService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {
    this.meliaId = this.data.id;
  }

  ngOnInit() {
    this.formInit();
  }

  private async formInit() {
    this.meliaTypeForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      availability: [null],
      HideCrossCutting: [false]
    });
    if (this.meliaId) {
      let { id, ...meliaValues } = await this.MeliaTypeService.getMeliaTypeById(
        this.meliaId
      );
      this.meliaTypeForm.setValue({
        ...meliaValues,
      });
    }
  }

  async submit() {
    this.meliaTypeForm.markAllAsTouched();
    this.meliaTypeForm.updateValueAndValidity();
    if (this.meliaTypeForm.valid) {
      await this.MeliaTypeService.submitMeliaType(
        this.meliaId,
        this.meliaTypeForm.value
      ).then(
        (data) => {
          if (this.meliaId == 0) this.toast.success("MELIA added successfully");
          else this.toast.success("MELIA updated successfully");

          this.dialogRef.close({ submitted: true });
        },
        (error) => {
          this.toast.error(error.error.message);
        }
      );
    }
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
