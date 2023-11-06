import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { OrganizationsService } from "src/app/services/organizations.service";
import { PhasesService } from "src/app/services/phases.service";

export interface DialogData {
  phase_id: number;
  initiative_id: number;
}

@Component({
  selector: "app-assign-organizations",
  templateUrl: "./assign-organizations.component.html",
  styleUrls: ["./assign-organizations.component.scss"],
})
export class AssignOrganizationsComponent implements OnInit {
  phaseId: number;
  initiativeId: number;
  assignOrgsForm: FormGroup;
  organizations: any = [];

  constructor(
    private dialogRef: MatDialogRef<AssignOrganizationsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private organizationsService: OrganizationsService,
    private phasesService: PhasesService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {
    this.phaseId = data.phase_id;
    this.initiativeId = data.initiative_id;
  }

  ngOnInit() {
    this.formInit();
  }

  private async formInit() {
    this.assignOrgsForm = this.fb.group({
      organizations: [null, Validators.required],
    });
    this.organizations = await this.organizationsService.getOrganizations();
    let AssignedOrganizations: any = await this.phasesService.getAssignedOrgs(
      this.phaseId,
      this.initiativeId
    );
    let OrganizationsCodes: string[] = [];
    if (AssignedOrganizations.length > 0) {
      AssignedOrganizations.forEach((organization: any) => {
        OrganizationsCodes.push(organization.code);
      });

      this.assignOrgsForm.setValue({
        organizations: OrganizationsCodes,
      });
    }
  }

  async submit() {
    if (this.assignOrgsForm.valid) {
      const organizations = this.assignOrgsForm.value.organizations;
      const data = {
        phase_id: this.phaseId,
        initiative_id: this.initiativeId,
        organizations: organizations,
      };
      await this.phasesService.assignPhaseInitOrgs(data);
      this.toast.success("Organizations assigned successfully");
      this.dialogRef.close({ submitted: true });
    }
  }

  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }
}
