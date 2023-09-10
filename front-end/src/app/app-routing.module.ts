import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubmissionComponent } from './submission/submission.component';
import { InitiativesComponent } from './initiatives/initiatives.component';
import { PhasesComponent } from './admin/phases/phases.component';
import { TeamMembersComponent } from './team-members/team-members.component';
import { PeriodsComponent } from './admin/periods/periods.component';
import { UsersComponent } from './admin/users/users.component';
import { AuthComponent } from './auth/auth.component';
import { SubmitedVersionsComponent } from './submited-versions/submited-versions.component';
import { SubmitedVersionComponent } from './submited-versions/submited-version/submited-version.component';
import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from './guards/admin.guard';
import { OrganizationsComponent } from './admin/organizations/organizations.component';
import { AdminIpsrComponent } from './admin/ipsr/admin-ipsr.component';
import { PhaseInitiativesComponent } from './admin/phases/phase-initiatives/phase-initiatives.component';

const routes: Routes = [
  { path: '', component: InitiativesComponent },
  { path: 'auth', component: AuthComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'organizations', component: OrganizationsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'phases', component: PhasesComponent },
      { path: 'periods', component: PeriodsComponent },
      { path: 'ipsr', component: AdminIpsrComponent },
    ],
  },
  { path: 'admin/phases/:id/initiatives', component: PhaseInitiativesComponent },
  { path: 'initiative/:id/:code/submission', component: SubmissionComponent },
  { path: 'initiative/:id/:code/submission/center', component: SubmissionComponent },
  { path: 'initiative/:id/:code/submited-versions', component: SubmitedVersionsComponent },
  { path: 'initiative/:id/:code/submited-versions/:id', component: SubmitedVersionComponent },
  { path: 'initiative/:id/:code/team-members', component: TeamMembersComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
