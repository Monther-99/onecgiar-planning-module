import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmComponent,
  ConfirmDialogModel,
} from 'src/app/confirm/confirm.component';
import { SubmissionService } from 'src/app/services/submission.service';

@Component({
  selector: 'app-center-status',
  templateUrl: './center-status.component.html',
  styleUrls: ['./center-status.component.scss'],
})
export class CenterStatusComponent implements OnInit {
  @Input('organization_id') organization_id: number;
  @Input('initiative_id') initiative_id: number;
  @Input('status') status: boolean;
  @Output() change = new EventEmitter<any>();

  constructor(
    private submissionService: SubmissionService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {}

  complete() {
    this.dialog
      .open(ConfirmComponent, {
        maxWidth: '400px',
        data: new ConfirmDialogModel(
          'Mark as Complete',
          `Are you sure you want to Mark it as complete?`
        ),
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
