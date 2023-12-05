import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Meta, Title } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";
import { DeleteConfirmDialogComponent } from "src/app/delete-confirm-dialog/delete-confirm-dialog.component";
import { HeaderService } from "src/app/header.service";
import { MeliaAdminDialogComponent } from "./melia-admin-dialog/melia-admin-dialog.component";
import { MeliaTypeService } from "src/app/services/melia-type.service";
@Component({
  selector: "app-melia-admin",
  templateUrl: "./melia-admin.component.html",
  styleUrls: ["./melia-admin.component.scss"],
})
export class MeliaAdminComponent implements OnInit {
  columnsToDisplay: string[] = [
    "id",
    "name",
    "description",
    "availability",
    "actions",
  ];
  dataSource: MatTableDataSource<any>;
  melia: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private MeliaTypeServiceService: MeliaTypeService,
    private dialog: MatDialog,
    private headerService: HeaderService,
    private toastr: ToastrService,
    private title: Title,
    private meta: Meta,
    private fb: FormBuilder
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

  filterForm: FormGroup = new FormGroup({});
  filters: any;
  setForm() {
    this.filterForm.valueChanges.subscribe(() => {
      this.initTable(this.filterForm.value);
      this.filters = this.filterForm.value;
    });
  }

  ngOnInit() {
    this.filterForm = this.fb.group({
      name: [null],
    });
    this.initTable();
    this.setForm();
  }

  async initTable(filter = null) {
    this.melia = await this.MeliaTypeServiceService.getMeliaTypes(filter);
    this.dataSource = new MatTableDataSource(this.melia);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.title.setTitle("MELIA");
    this.meta.updateTag({ name: "description", content: "MELIA" });
  }

  openDialog(id: number = 0): void {
    const dialogRef = this.dialog.open(MeliaAdminDialogComponent, {
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
          message: `Are you sure you want to delete this MELIA item?`,
        },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult == true) {
          await this.MeliaTypeServiceService.deleteMeliaType(id).then(
            (data) => {
              this.initTable();
              this.toastr.success("Deleted successfully");
            },
            (error) => {
              this.toastr.error(error.error.message);
            }
          );
        }
      });
  }
}
