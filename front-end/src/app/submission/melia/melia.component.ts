import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-melia',
  templateUrl: './melia.component.html',
  styleUrls: ['./melia.component.scss'],
})
export class MeliaComponent implements OnInit {
  meliaForm: FormGroup<any> =new FormGroup([]);
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  submit() {
    if (this.meliaForm.valid) this.dialogRef.close(this.meliaForm.value);
  }
  ngOnInit() {
    this.meliaForm = this.fb.group({
      title: [this.data?.title, Validators.required],
      description: [this.data?.description, Validators.required],
      initiative_id: [this.data?.initiative_id, Validators.required],
      wp_id: [this.data?.wp_id, Validators.required],
    });
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
