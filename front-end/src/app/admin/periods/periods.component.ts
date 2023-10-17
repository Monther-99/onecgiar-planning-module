import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { PeriodsService } from "src/app/services/periods.service";
import { PeriodDialogComponent } from "./period-dialog/period-dialog.component";
import {
  ConfirmComponent,
  ConfirmDialogModel,
} from "src/app/confirm/confirm.component";
import { HeaderService } from "src/app/header.service";

@Component({
  selector: "app-periods",
  templateUrl: "./periods.component.html",
  styleUrls: ["./periods.component.scss"],
})
export class PeriodsComponent implements AfterViewInit {
  columnsToDisplay: string[] = ["id", "phase", "year", "quarter", "actions"];
  dataSource: MatTableDataSource<any>;
  periods: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private periodsService: PeriodsService,
    private dialog: MatDialog,
    private headerService: HeaderService
  ) {
    this.headerService.background = "#04030f";
    this.headerService.backgroundNavMain = "#0f212f";
    this.headerService.backgroundUserNavButton = "#0f212f";
  }

  ngAfterViewInit() {
    this.initTable();
  }

  async initTable() {
    this.periods = await this.periodsService.getPeriods();
    this.dataSource = new MatTableDataSource(this.periods);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog(id: number = 0): void {
    const dialogRef = this.dialog.open(PeriodDialogComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.submitted) this.initTable();
    });
  }

  delete(id: number) {
    this.dialog
      .open(ConfirmComponent, {
        maxWidth: "400px",
        data: new ConfirmDialogModel(
          "Delete",
          `Are you sure you want to delete this Period item?`
        ),
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult == true) {
          let result = await this.periodsService.deletePeriod(id);
          if (result) this.initTable();
        }
      });
  }
}
