import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Meta, Title } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";
import { HeaderService } from "src/app/header.service";
import { ConstantService } from "src/app/services/constant.service";
@Component({
  selector: "app-parameters-settings",
  templateUrl: "./parameters-settings.component.html",
  styleUrls: ["./parameters-settings.component.scss"],
})
export class ParametersSettingsComponent {
  canSubmit!: boolean;
  publishValue: any;

  constructor(
    private constantService: ConstantService,
    private dialog: MatDialog,
    private toster: ToastrService,
    private headerService: HeaderService,
    private title: Title,
    private meta: Meta
  ) {
    this.headerService.background =
      "linear-gradient(to  bottom, #04030F, #020106)";
    this.headerService.backgroundNavMain =
      "linear-gradient(to  top, #0F212F, #09151E)";
    this.headerService.backgroundUserNavButton =
      "linear-gradient(to  top, #0F212F, #09151E)";
    this.headerService.backgroundFooter =
      "linear-gradient(to  top, #0F212F, #09151E)";
      this.headerService.backgroundDeleteYes = "#FF5A54";
      this.headerService.backgroundDeleteClose = "#04030F";
      this.headerService.backgroundDeleteLr = "#04030F";
      this.headerService.logoutSvg="brightness(0) saturate(100%) invert(4%) sepia(6%) saturate(6779%) hue-rotate(208deg) brightness(80%) contrast(104%)";

  }

  // displayedColumns: string[] = [
  //   'id',
  //   'lable',
  //   'value',
  //   'action',
  // ];

  async ngOnInit() {
    await this.getPublishStatus();
    // await this.getContatns();

    this.title.setTitle("Parameter settings");
    this.meta.updateTag({ name: "description", content: "Parameter settings" });
  }

  // async getContatns() {
  //   this.constants = await this.variableService.getConstantsVariable();
  // }

  async getPublishStatus() {
    this.publishValue = await this.constantService.getSubmitStatus();
    if (this.publishValue.value == "0") {
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
