import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HeaderService } from '../header.service';
import { ToastrService } from 'ngx-toastr';
import { Meta, Title } from '@angular/platform-browser';
import { InitiativeMeliaDialogComponent } from './initiative-melia-dialog/initiative-melia-dialog.component';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';
import { MeliaTypeService } from '../services/melia-type.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-initiative-melia',
  templateUrl: './initiative-melia.component.html',
  styleUrls: ['./initiative-melia.component.scss'],
})
export class InitiativeMeliaComponent implements OnInit {
  columnsToDisplay: string[] = ['melia_type', 'actions'];
  dataSource: MatTableDataSource<any>;
  initiativeMelias: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filterForm: FormGroup = new FormGroup({});
  filters: any;
  initiativeId: any;
  officialCode: any;

  constructor(
    private meliaTypeService: MeliaTypeService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private headerService: HeaderService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private title: Title,
    private meta: Meta
  ) {
    this.headerService.background =
      'linear-gradient(to  bottom, #04030F, #020106)';
    this.headerService.backgroundNavMain =
      'linear-gradient(to  top, #0F212F, #09151E)';
    this.headerService.backgroundUserNavButton =
      'linear-gradient(to  top, #0F212F, #09151E)';
    this.headerService.backgroundFooter =
      'linear-gradient(to  top, #0F212F, #09151E)';

    this.headerService.backgroundDeleteYes = '#FF5A54';
    this.headerService.backgroundDeleteClose = '#04030F';
    this.headerService.backgroundDeleteLr = '#04030F';
  }

  async ngOnInit() {
    const params: any = this.activatedRoute?.snapshot.params;
    this.initiativeId = params.id;
    this.officialCode = params.code;
    this.filterForm = this.fb.group({
      type: [null],
    });
    await this.initTable();
    this.setForm();
  }

  async initTable(filters = null) {
    this.initiativeMelias = await this.meliaTypeService.getInitiativeMelias(
      this.initiativeId, filters
    );
    this.dataSource = new MatTableDataSource(this.initiativeMelias);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.title.setTitle('MELIA');
    this.meta.updateTag({ name: 'description', content: 'MELIA' });
  }

  setForm() {
    this.filterForm.valueChanges.subscribe(() => {
      this.initTable(this.filterForm.value);
      this.filters = this.filterForm.value;
    });
  }

  async openDialog(id: number = 0) {
    let data = {
      initiative_id: this.initiativeId,
      id: id
    };
    if (id > 0) {
      data = await this.meliaTypeService.getInitiativeMeliaById(id);
    }
    const dialogRef = this.dialog.open(InitiativeMeliaDialogComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.meliaTypeService
          .submitInitiativeMelia(id, result.formValue)
          .subscribe(
            (data) => {
              if (data) {
                this.toastr.success(
                  `Initiative MELIA has been ${
                    id > 0 ? 'updated' : 'added'
                  }`
                );
                this.initTable();
              }
            },
            (error) => {
              this.toastr.error(error.error.message);
            }
          );
      }
    });
  }

  delete(id: number) {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        data: {
          title: 'Delete',
          message: `Are you sure you want to delete this item?`,
        },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult == true) {
          await this.meliaTypeService.deleteInitiativeMelia(id).then(
            (data) => {
              this.initTable();
              this.toastr.success('Deleted successfully');
            },
            (error) => {
              this.toastr.error(error.error.message);
            }
          );
        }
      });
  }

  resetForm() {
    this.filterForm.reset();
    this.filterForm.markAsUntouched();
  }
}
