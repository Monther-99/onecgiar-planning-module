import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { InitiativesService } from "../services/initiatives.service";
import { AuthService } from "../services/auth.service";
import { ROLES } from "../components/new-team-member/new-team-member.component";
import { AssignOrganizationsComponent } from "../assign-organizations/assign-organizations.component";
import { PhasesService } from "../services/phases.service";
import { MatDialog } from "@angular/material/dialog";
import { HeaderService } from "../header.service";

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: "app-initiatives",
  templateUrl: "./initiatives.component.html",
  styleUrls: ["./initiatives.component.scss"],
})
export class InitiativesComponent implements AfterViewInit {
  displayedColumns: string[] = [
    "id",
    "official_code",
    "name",
    "short_name",
    "my_role",
    "last_update_at",
    "status",
    "actions",
  ];
  dataSource: MatTableDataSource<any>;
  initiatives: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private initiativesService: InitiativesService,
    private authService: AuthService,
    private headerService: HeaderService,
    private phasesService: PhasesService,
    private dialog: MatDialog
  ) {
    this.headerService.background =
      "linear-gradient(to  bottom, #0F212F, #0E1E2B)";
    this.headerService.backgroundNavMain =
      "linear-gradient(to  bottom, #436280, #30455B)";
    this.headerService.backgroundUserNavButton =
      "linear-gradient(to  bottom, #436280, #30455B)";
  }
  user: any;
  async ngAfterViewInit() {
    this.initiatives = await this.initiativesService.getInitiatives();
    this.dataSource = new MatTableDataSource(this.initiatives);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.user = this.authService.getLoggedInUser();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  myRoles(roles: any) {
    const roles_ = roles.filter((d: any) => d.user_id == this.user.id);
    if (roles_.length) return roles_.map((d: any) => d.role).join(", ");
    else return this.IsAdmin() ? "Admin" : "Guest";
  }

  isLeader(roles: any) {
    const roles_ = roles.filter((d: any) => d.user_id == this.user.id);
    if (roles_.length)
      return roles_.map((d: any) => d.role)[0] == ROLES.LEAD || this.IsAdmin();
    else return this.IsAdmin();
  }

  IsAdmin() {
    return this.user.role == "admin" || false;
  }

  isCoordinator(roles: any) {
    const roles_ = roles.filter((d: any) => d.user_id == this.user.id);
    if (roles_.length)
      return roles_.map((d: any) => d.role)[0] == ROLES.COORDINATOR || false;
    else return false;
  }

  isContributor(roles: any) {
    const roles_ = roles.filter((d: any) => d.user_id == this.user.id);
    if (roles_.length)
      return roles_.map((d: any) => d.role)[0] == ROLES.CONTRIBUTOR || false;
    else return false;
  }

  async openDialog(id: number = 0) {
    const activePhase = await this.phasesService.getActivePhase();
    this.dialog.open(AssignOrganizationsComponent, {
      data: { phase_id: activePhase.id, initiative_id: id },
    });
  }
}
