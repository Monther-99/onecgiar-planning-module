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
import { DeleteConfirmDialogComponent } from "src/app/delete-confirm-dialog/delete-confirm-dialog.component";

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
    this.headerService.background =
      "linear-gradient(to  bottom, #04030F, #020106)";
    this.headerService.backgroundNavMain =
      "linear-gradient(to  top, #0F212F, #09151E)";
    this.headerService.backgroundUserNavButton =
      "linear-gradient(to  top, #0F212F, #09151E)";
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
      .open(DeleteConfirmDialogComponent, {
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
