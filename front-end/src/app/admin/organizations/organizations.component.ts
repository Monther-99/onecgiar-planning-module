import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { OrganizationsService } from "src/app/services/organizations.service";
import { OrganizationDialogComponent } from "./organization-dialog/organization-dialog.component";
import {
  ConfirmComponent,
  ConfirmDialogModel,
} from "src/app/confirm/confirm.component";
import { HeaderService } from "src/app/header.service";

@Component({
  selector: "app-organizations",
  templateUrl: "./organizations.component.html",
  styleUrls: ["./organizations.component.scss"],
})
export class OrganizationsComponent implements AfterViewInit {
  columnsToDisplay: string[] = ["id", "name", "acronym", "code", "actions"];
  dataSource: MatTableDataSource<any>;
  organizations: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private organizationsService: OrganizationsService,
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
    this.organizations = await this.organizationsService.getOrganizations();
    this.dataSource = new MatTableDataSource(this.organizations);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog(id: number = 0): void {
    const dialogRef = this.dialog.open(OrganizationDialogComponent, {
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
          `Are you sure you want to delete this Organization?`
        ),
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult == true) {
          let result = await this.organizationsService.deleteOrganization(id);
          if (result) this.initTable();
        }
      });
  }
}
