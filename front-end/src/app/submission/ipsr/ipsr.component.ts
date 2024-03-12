import { Component, ElementRef, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";

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
    private toast: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ipsrs: any;
  values: any;
  submit() {
    this.ipsrForm.markAllAsTouched();
    this.ipsrForm.updateValueAndValidity();
    if (this.ipsrForm.valid && !this.haveError) {
      this.dialogRef.close(this.ipsrForm.value);
    } else if(this.haveError) {
      this.toast.error('You can insert the numbers and range (X-Y) only.');
    }
    else if(!this.ipsrForm.valid) {
      this.toast.error('There Is Mandatory Field');
    }
  }
  ngOnInit() {
    this.ipsrs = this.data.ipsrs;
    this.values = this.data.values;
    let obj: any = {};
    let obj2: any = {};
    this.ipsrs.forEach((item: any) => {
      let ipsrValueArr = this.values.length
        ? this.values.filter((d: any) => d.ipsr_id == item.id)
        : [];
      let ipsrValue = ipsrValueArr.length ? ipsrValueArr[0].value : null;
      obj["value-" + item.id] = [ipsrValue];

      let ipsrDescription = ipsrValueArr.length ? ipsrValueArr[0].description : null;
      obj2["description-" + item.id] = [ipsrDescription];
    });
    this.ipsrForm = this.fb.group({
      ...obj,
      initiative_id: [this.data?.initiative_id, Validators.required],
      ...obj2
      
    });
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }
  haveError: boolean = false;
  change(event: any, item:any) {
    console.log('item', item)
    const array: any[] = event.split("")
    const arrError = [];
 
    for(let char of array) {
      if(Number(+char) || char == '-' || char == '0') {
        arrError.push('yes')
      } else {
        arrError.push('no')
      }
    }
    if(arrError.includes('no')) {
      this.haveError = true
    } else {
      this.haveError = false;
    }

    if(item.need_in_description && array.length > 0) {
      this.ipsrForm.setValidators([
        this.otherDescriptionValidator(item.id)
      ])
    } else {
      this.ipsrForm.clearValidators();
      this.ipsrForm.updateValueAndValidity()
    }
  }


  private otherDescriptionValidator = (id:any) => {
    return (controlGroup: any) => {
      let controls = controlGroup.controls;
      if (controls) {
        if (
          controls['description-' + id].value == "" ||
          controls['description-' + id].value == null
        ) {
          return {
            ['descriptionRequired' + id]: {
              text: "This field is mandatory",
            },
          };
        }
      }
      return null;
    };
  };




  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }
}
