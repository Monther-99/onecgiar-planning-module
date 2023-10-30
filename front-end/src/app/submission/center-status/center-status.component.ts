import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
  ConfirmComponent,
  ConfirmDialogModel,
} from "src/app/confirm/confirm.component";
import { DeleteConfirmDialogComponent } from "src/app/delete-confirm-dialog/delete-confirm-dialog.component";
import { SubmissionService } from "src/app/services/submission.service";

@Component({
  selector: "app-center-status",
  templateUrl: "./center-status.component.html",
  styleUrls: ["./center-status.component.scss"],
})
export class CenterStatusComponent implements OnInit {
  @Input("organization_id") organization_id: number;
  @Input("initiative_id") initiative_id: number;
  @Input("status") status: boolean;
  @Output() change = new EventEmitter<any>();

  constructor(
    private submissionService: SubmissionService,
    public dialog: MatDialog
  ) {}

  a: any;
  ngOnInit(): void {}

  complete() {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        data: {
          title: "Mark as Complete",
          message: `Are you sure you want to Mark it as ${
            this.status ? "" : "In"
          }complete?`,
          svg: `../../../../assets/shared-image/${
            this.status ? "checked-2.png" : "delete-file.png"
          }`,
        },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult == true) {
          let result = await this.submissionService.markStatus(
            +this.organization_id,
            +this.initiative_id,
            !!this.status
          );
          if (result) this.change.emit(!!this.status);
        }
      });
  }
}
