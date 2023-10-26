import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
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
import { ToastrService } from "ngx-toastr";
import { Meta, Title } from "@angular/platform-browser";
import { FormBuilder, FormGroup } from "@angular/forms";
@Component({
  selector: "app-periods",
  templateUrl: "./periods.component.html",
  styleUrls: ["./periods.component.scss"],
})
export class PeriodsComponent implements OnInit {
  columnsToDisplay: string[] = ["id", "phase", "year", "quarter", "actions"];
  dataSource: MatTableDataSource<any>;
  periods: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  phases:any[] = [];
  filterForm: FormGroup = new FormGroup({});
  length!: number;
  pageSize: number = 10;
  pageIndex: number = 1;
  filters: any = null;

  constructor(
    private periodsService: PeriodsService,
    private dialog: MatDialog,
    private headerService: HeaderService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private title: Title,
    private meta: Meta
  ) {
    this.headerService.background =
      "linear-gradient(to  bottom, #04030F, #020106)";
    this.headerService.backgroundNavMain =
      "linear-gradient(to  top, #0F212F, #09151E)";
    this.headerService.backgroundUserNavButton =
      "linear-gradient(to  top, #0F212F, #09151E)";
  }

  async ngOnInit() {
    this.filterForm = this.fb.group({
      phase: [null],
    });
    await this.initTable();
    this.setForm();
  }
  setForm() {
    this.filterForm.valueChanges.subscribe(() => {
      this.filters = this.filterForm.value;
      this.pageIndex = 1;
      this.pageSize = 10;
      this.initTable(this.filters);
    });
  }
  async pagination(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.initTable(this.filters);
  }

  async initTable(filters = null) {
    this.periods = await this.periodsService.getPeriods(
      filters,
      this.pageIndex,
      this.pageSize
    );
    this.dataSource = new MatTableDataSource(this.periods?.result);
    this.length = this.periods?.count
    this.periods?.result?.forEach((d:any) => {
      this.phases.push(d.phase);
    })
    this.phases = this.phases.filter((value, index, self) =>
      index === self.findIndex((t) => (
      t.id === value.id && t.name === value.name
      ))
    )
    this.title.setTitle("Periods");
    this.meta.updateTag({ name: "description", content: "Periods" });
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
        data: {
          title: "Delete",
          message: `Are you sure you want to delete this Period item?`,
        },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult == true) {
          let result = await this.periodsService.deletePeriod(id);
          if (result != false) {
            this.initTable();
            this.toastr.success("Deleted successfully");
          }
        }
      });
  }
}
