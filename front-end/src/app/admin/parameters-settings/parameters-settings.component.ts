import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConstantService } from 'src/app/services/constant.service';
@Component({
  selector: 'app-parameters-settings',
  templateUrl: './parameters-settings.component.html',
  styleUrls: ['./parameters-settings.component.scss']
})
export class ParametersSettingsComponent {
  canSubmit!: boolean;
  publishValue: any;

  constructor(
    private constantService: ConstantService,
    private dialog: MatDialog,
    private toster: ToastrService,
  ) {}

  // displayedColumns: string[] = [
  //   'id',
  //   'lable',
  //   'value',
  //   'action',
  // ];

  async ngOnInit() {
    await this.getPublishStatus();
    // await this.getContatns();
  }

  // async getContatns() {
  //   this.constants = await this.variableService.getConstantsVariable();
  // }

  async getPublishStatus() {
    this.publishValue = await this.constantService.getSubmitStatus();
    if (this.publishValue.value == '0') {
      this.canSubmit = false;
    } else {
      this.canSubmit = true;
    }
  }

  async toggle() {
    this.canSubmit = !this.canSubmit;
    this.constantService.updateSubmitStatus(this.canSubmit);
  }
}
