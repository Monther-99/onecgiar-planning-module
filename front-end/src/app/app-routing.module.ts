import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SubmissionComponent } from "./submission/submission.component";
import { InitiativesComponent } from "./initiatives/initiatives.component";
import { PhasesComponent } from "./admin/phases/phases.component";
import { TeamMembersComponent } from "./team-members/team-members.component";
import { PeriodsComponent } from "./admin/periods/periods.component";
import { UsersComponent } from "./admin/users/users.component";
import { AuthComponent } from "./auth/auth.component";
import { SubmitedVersionsComponent } from "./submited-versions/submited-versions.component";
import { SubmitedVersionComponent } from "./submited-versions/submited-version/submited-version.component";
import { AdminComponent } from "./admin/admin.component";
import { AdminGuard } from "./guards/admin.guard";
import { OrganizationsComponent } from "./admin/organizations/organizations.component";
import { AdminIpsrComponent } from "./admin/ipsr/admin-ipsr.component";
import { PhaseInitiativesComponent } from "./admin/phases/phase-initiatives/phase-initiatives.component";
import { AuthGuard } from "./guards/auth.guard";
import { AccessDeniedComponent } from "./access-denied/access-denied.component";
import { LicenseComponent } from "./footer/license/license.component";
import { ParametersSettingsComponent } from "./admin/parameters-settings/parameters-settings.component";
import { MeliaAdminComponent } from "./admin/melia-admin/melia-admin.component";
import { AnticipatedYearComponent } from "./admin/anticipated-year/anticipated-year.component";

const routes: Routes = [
  { path: "", component: InitiativesComponent },
  { path: "auth", component: AuthComponent },
  {
    path: "admin",
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      { path: "", redirectTo: "users", pathMatch: "full" },
      { path: "organizations", component: OrganizationsComponent },
      { path: "users", component: UsersComponent },
      { path: "phases", component: PhasesComponent },
      { path: "periods", component: PeriodsComponent },
      { path: "ipsr", component: AdminIpsrComponent },
      { path: "phases/:id/initiatives", component: PhaseInitiativesComponent },
      { path: "parameters-settings", component: ParametersSettingsComponent },
      { path: "melia", component: MeliaAdminComponent },
      { path: "Anticipated-year", component: AnticipatedYearComponent },

    ],
  },
  {
    path: "initiative/:id/:code/submission",
    component: SubmissionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "initiative/:id/:code/submission/center",
    component: SubmissionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "initiative/:id/:code/submited-versions",
    component: SubmitedVersionsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "initiative/:id/:code/submited-versions/:id",
    component: SubmitedVersionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "initiative/:id/:code/team-members",
    component: TeamMembersComponent,
    canActivate: [AuthGuard],
  },
  { path: "denied", component: AccessDeniedComponent },
  {
    path: "license",
    component: LicenseComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "top",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
