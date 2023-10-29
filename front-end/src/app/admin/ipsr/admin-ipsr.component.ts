import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { IpsrService } from "src/app/services/ipsr.service";
import { IpsrDialogComponent } from "./ipsr-dialog/ipsr-dialog.component";
import {
  ConfirmComponent,
  ConfirmDialogModel,
} from "src/app/confirm/confirm.component";
import { HeaderService } from "src/app/header.service";
import { DeleteConfirmDialogComponent } from "src/app/delete-confirm-dialog/delete-confirm-dialog.component";
import { ToastrService } from "ngx-toastr";
import { Meta, Title } from "@angular/platform-browser";

@Component({
  selector: "app-admin-ipsr",
  templateUrl: "./admin-ipsr.component.html",
  styleUrls: ["./admin-ipsr.component.scss"],
})
export class AdminIpsrComponent implements AfterViewInit {
  columnsToDisplay: string[] = ["id", "title", "description", "actions"];
  dataSource: MatTableDataSource<any>;
  ipsrs: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private ipsrService: IpsrService,
    private dialog: MatDialog,
    private headerService: HeaderService,
    private toastr: ToastrService,
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
  }

  ngAfterViewInit() {
    this.initTable();
  }

  async initTable() {
    this.ipsrs = await this.ipsrService.getIpsrs();
    this.dataSource = new MatTableDataSource(this.ipsrs);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.title.setTitle("IPSR");
    this.meta.updateTag({ name: "description", content: "IPSR" });
  }

  openDialog(id: number = 0): void {
    const dialogRef = this.dialog.open(IpsrDialogComponent, {
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
          message: `Are you sure you want to delete this IPSR item?`,
        },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult == true) {
          let result = await this.ipsrService.deleteIpsr(id);
          if (result != false) {
            this.initTable();
            this.toastr.success("Deleted successfully");
          }
        }
      });
  }
}
