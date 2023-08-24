import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cross-cutting',
  templateUrl: './cross-cutting.component.html',
  styleUrls: ['./cross-cutting.component.scss'],
})
export class CrossCuttingComponent implements OnInit {
  crossForm: FormGroup<any> = new FormGroup([]);
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  submit() {
    if (this.crossForm.valid) this.dialogRef.close(this.crossForm.value);
  }
  ngOnInit() {
    this.crossForm = this.fb.group({
      title: [this.data?.title, Validators.required],
      description: [this.data?.description, Validators.required],
      initiative_id: [this.data?.initiative_id, Validators.required],
    });
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
