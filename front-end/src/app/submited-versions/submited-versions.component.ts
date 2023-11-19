import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
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
import { Meta, Title } from "@angular/platform-browser";

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
    private headerService: HeaderService,
    private title: Title,
    private meta: Meta
  ) {
    this.headerService.background =
      "linear-gradient(to right, #04030F, #04030F)";
    this.headerService.backgroundNavMain =
      "linear-gradient(to right, #2A2E45, #212537)";
    this.headerService.backgroundUserNavButton =
      "linear-gradient(to right, #2A2E45, #212537)";

    this.headerService.backgroundFooter =
      "linear-gradient(to top right, #2A2E45, #212537)";
  }
  user: any;
  params: any;
  initiativeId: any;
  officalCode: any;
  allfilters: any;
  length!: number;
  pageSize: number = 10;
  pageIndex: number = 1;
  async ngAfterViewInit() {
    this.params = this.activatedRoute?.snapshot.params;
    await this.initData();

    this.user = this.authService.getLoggedInUser();
  }
  async initData(filters = null) {
    this.initiativeId = this.params.id;
    this.officalCode = this.params.code;

    this.submissions =
      await this.submissionService.getSubmissionsByInitiativeId(
        this.params.id,
        filters,
        this.pageIndex,
        this.pageSize,
        true
      );
    console.log("main Data", this.submissions);
    this.dataSource = new MatTableDataSource(this.submissions?.result);
    this.length = this.submissions?.count;

    this.title.setTitle("Submitted versions");
    this.meta.updateTag({ name: "description", content: "Submitted versions" });
  }

  filter(filters: any) {
    this.allfilters = filters;
    this.pageIndex = 1;
    this.pageSize = 10;
    this.initData(filters);
    this.paginator.pageSize = 0;
  }

  async pagination(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.initData(this.allfilters);
  }

  changeStatus(id: number) {
    const dialogRef = this.dialog.open(StatusComponent, {
      data: { id },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.initData();
        this.toastrService.success("Status changed successfully");
      }
    });
  }
}
