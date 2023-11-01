import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {
  ConfirmComponent,
  ConfirmDialogModel,
} from "src/app/confirm/confirm.component";
import {
  NewTeamMemberComponent,
  ROLES,
} from "src/app/components/new-team-member/new-team-member.component";
import { InitiativesService } from "src/app/services/initiatives.service";
import { UserService } from "src/app/services/user.service";
import { HeaderService } from "../header.service";
import { DeleteConfirmDialogComponent } from "../delete-confirm-dialog/delete-confirm-dialog.component";
import { Meta, Title } from "@angular/platform-browser";

@Component({
  selector: "app-team-members",
  templateUrl: "./team-members.component.html",
  styleUrls: ["./team-members.component.scss"],
})
export class TeamMembersComponent {
  initiativeId: any;
  officalCode: any;
  constructor(
    public router: Router,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private initiativeService: InitiativesService,
    private toastrService: ToastrService,
    private userService: UserService,
    private headerService: HeaderService,
    private title: Title,
    private meta: Meta
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
  user_info: any;
  my_roles: any;
  InitiativeUsers: any;

  id: number = 0;
  async ngOnInit() {
    const params: any = this.activatedRoute?.snapshot.params;
    this.initiativeId = params.id;
    this.officalCode = params.code;
    console.log(this.officalCode);
    this.id = params.id;
    this.loadInitiativeRoles();
    this.user_info = this.userService.getLogedInUser();
    this.InitiativeUsers = await this.initiativeService.getInitiativeUsers(
      this.id
    );
    this.my_roles = this.InitiativeUsers.filter(
      (d: any) => d?.user?.id == this?.user_info?.id
    ).map((d: any) => d.role);
    // if (this.canEdit())
    this.displayedColumns.push("Actions");

    this.title.setTitle("Manage initiative team");
    this.meta.updateTag({
      name: "description",
      content: "Manage initiative team",
    });
  }

  async init() {}
  canEdit() {
    return (
      this.user_info.role == "admin" ||
      this.my_roles?.includes(ROLES.LEAD) ||
      this.my_roles?.includes(ROLES.COORDINATOR) ||
      this.my_roles?.includes(ROLES.CONTRIBUTOR)
    );
  }
  async deleteMember(roleId: number) {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        data: {
          title: "Delete",
          message: `Are you sure you want to delete user role ?`,
        },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult) {
          await this.initiativeService.deleteInitiativeRole(
            this.initiativeId,
            roleId
          );
          this.loadInitiativeRoles();
          this.toastrService.success(`User role has been deleted`);
        }
      });
  }

  async openNewTeamMemberDialog() {
    const dialogRef = this.dialog.open(NewTeamMemberComponent, {
      data: { role: "add", member: null, initiative_id: this.initiativeId },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result?.role == "add") {
        // access new data => result.formValue
        const email = result.formValue.email;
        const userRole = result.formValue.userRole;
        console.log({ email, userRole });
        // handel add memeber API service
        this.initiativeService
          .createNewInitiativeRole(this.initiativeId, {
            initiative_id: this.initiativeId,
            email: result.formValue.email,
            role: result.formValue.userRole,
            user_id: result.formValue.user_id,
            organizations: result.formValue.organizations,
          })
          .subscribe(
            (data) => {
              if (data) {
                this.toastrService.success(`User role has been added`);
                this.loadInitiativeRoles();
              }
            },
            (error) => {
              this.toastrService.error(error.error.message);
            }
          );
      }
    });
  }

  openEditTeamMemberDialog(roleId: number, role: any) {
    const dialogRef = this.dialog.open(NewTeamMemberComponent, {
      data: { role: "edit", member: role, initiative_id: this.initiativeId },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result?.role == "edit") {
        // access edited data => result.formValue
        this.initiativeService
          .updateInitiativeRole(this.initiativeId, roleId, {
            initiative_id: this.initiativeId,
            id: roleId,
            user_id: result.formValue.user_id,
            email: result.formValue.email,
            role: result.formValue.userRole,
            organizations: result.formValue.organizations,
          })
          .subscribe(
            (data) => {
              if (data) {
                this.toastrService.success(`User role has been updated`);
                this.loadInitiativeRoles();
              }
            },
            (error) => {
              this.toastrService.error(error.error.message);
            }
          );
      }
    });
  }

  displayedColumns: string[] = [
    /*'User Name',*/ "Email",
    "User",
    "Role",
    "organizations",
    "Creation Date",
    "Status",
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: any;

  join(data: any) {
    return data.map((d: any) => d.name).join(", ");
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async loadInitiativeRoles() {
    var data: any = await this.initiativeService.getInitiativeRoles(
      this.initiativeId
    );

    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }
}
