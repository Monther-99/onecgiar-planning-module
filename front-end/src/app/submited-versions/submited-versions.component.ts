
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InitiativesService } from '../services/initiatives.service';
import { AuthService } from '../services/auth.service';
import { ROLES } from '../components/new-team-member/new-team-member.component';
import { SubmissionService } from '../services/submission.service';
import { ActivatedRoute } from '@angular/router';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-submited-versions',
  templateUrl: './submited-versions.component.html',
  styleUrls: ['./submited-versions.component.scss']
})
export class SubmitedVersionsComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'phase',
    'created_by',
    'created_at',
    'actions',
  ];
  dataSource: MatTableDataSource<any>;
  submissions: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private submissionService: SubmissionService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ) {}
  user: any;
  async ngAfterViewInit() {
    const params: any = this.activatedRoute?.snapshot.params;
    this.submissions = await this.submissionService.getSubmissionsByInitiativeId(params.id);
    this.dataSource = new MatTableDataSource(this.submissions);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.user = this.authService.getLogedInUser();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

 
}
