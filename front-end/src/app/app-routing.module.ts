import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubmissionComponent } from './submission/submission.component';
import { InitiativesComponent } from './initiatives/initiatives.component';
import { PhasesComponent } from './admin/phases/phases.component';
import { TeamMembersComponent } from './team-members/team-members.component';
import { PeriodsComponent } from './admin/periods/periods.component';
import { UsersComponent } from './admin/users/users.component';

const routes: Routes = [
  { path: '', component: InitiativesComponent },
  { path: 'submission/:id/:code', component: SubmissionComponent },
  { path: 'admin/phases', component: PhasesComponent },
  { path: 'admin/periods', component: PeriodsComponent },
  { path: 'admin/users', component: UsersComponent },
  { path: 'submission/:id/:code/team-members', component: TeamMembersComponent },
  { path: 'submission/:id/:code/center', component: SubmissionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
