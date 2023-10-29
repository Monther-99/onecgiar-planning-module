import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { InitiativesService } from "../services/initiatives.service";
import { AuthService } from "../services/auth.service";
import { ROLES } from "../components/new-team-member/new-team-member.component";
import { SubmissionService } from "../services/submission.service";
import { ActivatedRoute } from "@angular/router";
import { StatusComponent } from "./status/status.component";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { HeaderService } from "../header.service";

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: "app-submited-versions",
  templateUrl: "./submited-versions.component.html",
  styleUrls: ["./submited-versions.component.scss"],
})
export class SubmitedVersionsComponent implements AfterViewInit {
  displayedColumns: string[] = [
    "id",
    "phase",
    "created_by",
    "created_at",
    "status",
    "status_reason",
    "actions",
  ];
  dataSource: MatTableDataSource<any>;
  submissions: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private submissionService: SubmissionService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private headerService: HeaderService
  ) {
    this.headerService.background =
      "linear-gradient(to  bottom, #0F212F, #0E1E2B)";
    this.headerService.backgroundNavMain =
      "linear-gradient(to  bottom, #436280, #30455B)";
    this.headerService.backgroundUserNavButton =
      "linear-gradient(to  bottom, #436280, #30455B)";
    this.headerService.backgroundFooter =
      "linear-gradient(to top right, #436280, #263749)";
  }
  user: any;
  params: any;
  initiativeId: any;
  officalCode: any;
  async ngAfterViewInit() {
    this.params = this.activatedRoute?.snapshot.params;
    await this.initData();

    this.user = this.authService.getLoggedInUser();
  }
  async initData() {
    console.log(this.params);

    this.initiativeId = this.params.id;
    this.officalCode = this.params.code;

    this.submissions =
      await this.submissionService.getSubmissionsByInitiativeId(this.params.id);
    this.dataSource = new MatTableDataSource(this.submissions);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  changeStatus(id: number) {
    const dialogRef = this.dialog.open(StatusComponent, {
      data: { id },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.initData();
        this.toastrService.success("Status changed successfully", "Success");
      }
    });
  }
}
