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

const routes: Routes = [
  { path: '', component: InitiativesComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'admin/phases', component: PhasesComponent },
  { path: 'admin/periods', component: PeriodsComponent },
  { path: 'admin/users', component: UsersComponent },
  { path: 'initiative/:id/:code/submission', component: SubmissionComponent },
  { path: 'initiative/:id/:code/submission/center', component: SubmissionComponent },
  { path: 'initiative/:id/:code/submited-versions', component: SubmitedVersionsComponent },
  { path: 'initiative/:id/:code/team-members', component: TeamMembersComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
