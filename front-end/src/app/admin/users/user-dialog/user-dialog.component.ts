import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { UserService } from "src/app/services/user.service";

export interface DialogData {
  id: number;
}

@Component({
  selector: "app-user-dialog",
  templateUrl: "./user-dialog.component.html",
  styleUrls: ["./user-dialog.component.scss"],
})
export class UserDialogComponent implements OnInit {
  userId: number = 0;
  userForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private usersService: UserService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {
    this.userId = data.id;
  }

  ngOnInit() {
    this.formInit();
  }

  private async formInit() {
    this.userForm = this.fb.group({
      email: [null, Validators.required],
      first_name: [null, Validators.required],
      last_name: [null, Validators.required],
      role: [null, Validators.required],
    });
    if (this.userId) {
      let { id, ...userValues } = await this.usersService.getUser(this.userId);
      this.userForm.setValue({
        ...userValues,
      });
    }
  }

  async submit() {
    if (this.userForm.valid) {
      await this.usersService.submitUser(this.userId, this.userForm.value);
      this.toast.success("User saved successfully");
      this.dialogRef.close({ submitted: true });
    }
  }
}
