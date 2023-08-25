import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubmissionComponent } from './submission/submission.component';
import { InitiativesComponent } from './initiatives/initiatives.component';

const routes: Routes = [
  { path: '', component: InitiativesComponent },
  { path: 'submission/:id/:code', component: SubmissionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
