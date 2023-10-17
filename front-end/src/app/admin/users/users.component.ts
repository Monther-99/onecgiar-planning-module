import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { UserService } from "src/app/services/user.service";
import { UserDialogComponent } from "./user-dialog/user-dialog.component";
import {
  ConfirmComponent,
  ConfirmDialogModel,
} from "src/app/confirm/confirm.component";
import { HeaderService } from "src/app/header.service";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements AfterViewInit {
  columnsToDisplay: string[] = ["id", "name", "email", "role", "actions"];
  dataSource: MatTableDataSource<any>;
  users: any = [];
  length!: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private usersService: UserService,
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
    this.users = await this.usersService.getAllUsers();
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.length = this.users.length;
  }

  openDialog(id: number = 0): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
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
          `Are you sure you want to delete this User?`
        ),
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult == true) {
          let result = await this.usersService.deleteUser(id);
          if (result) this.initTable();
        }
      });
  }
}
