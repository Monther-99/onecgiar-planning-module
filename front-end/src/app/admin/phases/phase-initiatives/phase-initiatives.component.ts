import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Params } from "@angular/router";
import { AssignOrganizationsComponent } from "src/app/assign-organizations/assign-organizations.component";
import { PhasesService } from "src/app/services/phases.service";

@Component({
  selector: "app-phase-initiatives",
  templateUrl: "./phase-initiatives.component.html",
  styleUrls: ["./phase-initiatives.component.scss"],
})
export class PhaseInitiativesComponent {
  columnsToDisplay: string[] = [
    "id",
    "official_code",
    "name",
    "organizations",
    "actions",
  ];
  dataSource: MatTableDataSource<any>;
  initiatives: any = [];
  phaseId: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private phasesService: PhasesService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit() {
    this.route.params.subscribe((params: Params) => {
      this.phaseId = +params["id"];
      this.initTable();
    });
  }

  async initTable() {
    this.initiatives = await this.phasesService.getInitiatives(this.phaseId);
    this.dataSource = new MatTableDataSource(this.initiatives);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog(id: number = 0): void {
    const dialogRef = this.dialog.open(AssignOrganizationsComponent, {
      data: { phase_id: this.phaseId, initiative_id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.submitted) this.initTable();
    });
  }
}
