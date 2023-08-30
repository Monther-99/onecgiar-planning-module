import { Component, OnInit } from '@angular/core';

import { example_data } from './example';
import { SubmissionService } from '../services/submission.service';
import { AppSocket } from '../socket.service';
import { MatDialog } from '@angular/material/dialog';
import { MeliaComponent } from './melia/melia.component';
import {
  ConfirmComponent,
  ConfirmDialogModel,
} from '../confirm/confirm.component';
import { CrossCuttingComponent } from './cross-cutting/cross-cutting.component';
import { ViewDataComponent } from './view-data/view-data.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss'],
})
export class SubmissionComponent implements OnInit {
  title = 'planning';
  constructor(
    private submissionService: SubmissionService,
    private socket: AppSocket,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute
  ) {}
  data: any = [];
  wps: any = [];
  partners: any = [];
  result: any;
  partnersData: any = {};
  sammary: any = {};
  allData: any = {};
  values: any = {};
  totals: any = {};
  errors: any = {};
  period: Array<any> = [];
  check(values: any, code: string, id: number, item_id: string) {
    if (values[code] && values[code][id] && values[code][id][item_id]) {
      return true;
    } else if (values[code] && !values[code][id]) {
      values[code][id] = {};
      values[code][id][item_id] = 0;
      this.totals[code][id] = 0;
      this.errors[code][id] = null;
      return true;
    } else if (values[code] && values[code][id] && !values[code][id][item_id]) {
      values[code][id][item_id] = 0;
      return true;
    } else {
      values[code] = {};
      values[code][id] = {};
      values[code][id][item_id] = 0;
      this.totals[code] = {};
      this.totals[code][id] = 0;
      this.errors[code] = {};
      this.errors[code][id] = null;
      return true;
    }
  }
  calclate(code: any, id: any) {
    if (this.totals[code] && this.totals[code][id])
      return this.totals[code][id];
  }
  timeCalc: any;
  async changeCalc(partner_code: any, wp_id: any, item_id: any, value: any) {
    if (this.timeCalc) clearTimeout(this.timeCalc);
    this.timeCalc = setTimeout(async () => {
      const result = await this.submissionService.saveResultValue(
        this.params.id,
        {
          partner_code,
          wp_id,
          item_id,
          value,
        }
      );
      if (result)
        this.socket.emit('setDataValue', {
          id: this.params.id,
          partner_code,
          wp_id,
          item_id,
          value,
        });
      this.sammaryCalc();
    }, 500);

    // localStorage.setItem('initiatives', JSON.stringify(this.values));
  }

  perValues: any = {};
  perValuesSammary: any = {};
  perAllValues: any = {};
  sammaryTotal: any = {};

  async changes(
    partner_code: any,
    wp_id: any,
    item_id: any,
    per_id: number,
    value: any
  ) {
    if (!this.perValues[partner_code]) this.perValues[partner_code] = {};
    if (!this.perValues[partner_code][wp_id])
      this.perValues[partner_code][wp_id] = {};
    if (!this.perValues[partner_code][wp_id][item_id])
      this.perValues[partner_code][wp_id][item_id] = {};

    this.perValues[partner_code][wp_id][item_id][per_id] = value;

    this.allvalueChange();
  }
  async changeEnable(
    partner_code: any,
    wp_id: any,
    item_id: any,
    per_id: number,
    event: any
  ) {
    this.changes(partner_code, wp_id, item_id, per_id, event.checked);
    const result = await this.submissionService.saveResultValues(
      this.params.id,
      {
        partner_code,
        wp_id,
        item_id,
        per_id,
        value: event.checked,
      }
    );
    if (result)
      this.socket.emit('setDataValues', {
        id: this.params.id,
        partner_code,
        wp_id,
        item_id,
        per_id,
        value: event.checked,
      });
  }
  wpsTotalSum = 0;
  sammaryCalc() {
    let totalsum: any = {};
    let totalsumcenter: any = {};
    let totalWp: any = {};

    Object.keys(this.values).forEach((code) => {
      Object.keys(this.values[code]).forEach((wp_id) => {
        let total = 0;
        Object.keys(this.values[code][wp_id]).forEach((d) => {
          total += +this.values[code][wp_id][d];
        });
        if (total > 100) {
          this.errors[code][wp_id] =
            'total percentage cannot be over 100 percent';
        } else {
          this.errors[code][wp_id] = null;
        }
        this.totals[code][wp_id] = total;

        Object.keys(this.values[code][wp_id]).forEach((item_id) => {
          if (!totalsum[wp_id]) totalsum[wp_id] = {};
          if (!totalsum[wp_id][item_id]) totalsum[wp_id][item_id] = 0;
          totalsum[wp_id][item_id] += +this.values[code][wp_id][item_id];
        });
        // Sum(percentage from each output from each center for each WP) / Sum(total percentage for each WP for each center)
      });
    });

    Object.keys(this.totals).forEach((code) => {
      Object.keys(this.totals[code]).forEach((wp_id) => {
        if (!totalsumcenter[wp_id]) totalsumcenter[wp_id] = 0;
        totalsumcenter[wp_id] += +this.totals[code][wp_id];
        // Sum(percentage from each output from each center for each WP) / Sum(total percentage for each WP for each center)
      });
    });

    Object.keys(totalsum).forEach((wp_id) => {
      Object.keys(totalsum[wp_id]).forEach((item_id) => {
        if (!totalWp[wp_id]) totalWp[wp_id] = {};
        if (+totalsum[wp_id][item_id] && +totalsumcenter[wp_id])
          totalWp[wp_id][item_id] =
            +(+totalsum[wp_id][item_id] / +totalsumcenter[wp_id]) * 100;
        else totalWp[wp_id][item_id] = 0;
      });
    });
    Object.keys(totalWp).forEach((wp_id) => {
      Object.keys(totalWp[wp_id]).forEach((item_id) => {
        this.sammary[wp_id][item_id] = totalWp[wp_id][item_id];
      });
    });

    Object.keys(this.sammary).forEach((wp_id) => {
      this.sammaryTotal[wp_id] = 0;
      Object.keys(this.sammary[wp_id]).forEach((item_id) => {
        this.sammaryTotal[wp_id] += totalWp[wp_id][item_id];
      });
    });
    this.wpsTotalSum = 0;
    Object.keys(this.sammaryTotal).forEach((wp_id) => {
      this.wpsTotalSum += this.sammaryTotal[wp_id];
    });
    this.wpsTotalSum = this.wpsTotalSum / Object.keys(this.sammaryTotal).length;
  }
  allvalueChange() {
    for (let wp of this.wps) {
      this.allData[wp.ost_wp.wp_official_code].forEach((item: any) => {
        this.period.forEach((element) => {
          if (!this.perAllValues[wp.ost_wp.wp_official_code])
            this.perAllValues[wp.ost_wp.wp_official_code] = {};
          if (!this.perAllValues[wp.ost_wp.wp_official_code][item.id])
            this.perAllValues[wp.ost_wp.wp_official_code][item.id] = {};
          this.perAllValues[wp.ost_wp.wp_official_code][item.id][element.id] =
            false;
        });
      });
    }
    this.wps.forEach((wp: any) => {
      this.period.forEach((per) => {
        this.perValuesSammary[wp.ost_wp.wp_official_code][per.id] = false;
      });
    });

    Object.keys(this.perValues).forEach((partner_code) => {
      Object.keys(this.perValues[partner_code]).forEach((wp_id) => {
        Object.keys(this.perValues[partner_code][wp_id]).forEach((item_id) => {
          Object.keys(this.perValues[partner_code][wp_id][item_id]).forEach(
            (per_id) => {
              if (this.perValues[partner_code][wp_id][item_id][per_id] == true)
                this.perAllValues[wp_id][item_id][per_id] =
                  this.perValues[partner_code][wp_id][item_id][per_id];

              if (this.perValues[partner_code][wp_id][item_id][per_id] == true)
                this.perValuesSammary[wp_id][per_id] = true;
            }
          );
        });
      });
    });
  }

  async refresh() {
    await this.InitData();
  }
  results: any;
  loading = false;
  params: any;
  initiative_data: any = {};
  async InitData() {
    this.loading = true;
    this.wpsTotalSum = 0;
    this.perValues = {};
    this.perValuesSammary = {};
    this.perAllValues = {};
    this.sammaryTotal = {};
    this.data = [];
    this.wps = [];
    this.partners = [];
    this.partnersData = {};
    this.sammary = {};
    this.allData = {};
    this.values = {};
    this.totals = {};
    this.errors = {};

    this.results = await this.submissionService.getToc(this.params.id);
    const melia_data = await this.submissionService.getMeliaByInitiative(
      this.params.id
    );
    const cross_data = await this.submissionService.getCrossByInitiative(
      this.params.id
    );
    this.initiative_data = await this.submissionService.getInitiative(
      this.params.id
    );
    this.partners = await this.submissionService.getOrganizations();

    // const indicators_data = this.results
    //   .filter(
    //     (d: any) =>
    //       (d.category == 'OUTPUT' || d.category == 'OUTCOME') &&
    //       d.indicators.length
    //   )
    //   .map((d: any) => {
    //     return d.indicators.map((i: any) => {
    //       return {
    //         ...i,
    //         title: i.description,
    //         category: 'INDICATOR',
    //         group: d.group,
    //       };
    //     });
    //   })
    //   .flat(1);
    cross_data.map((d: any) => {
      d['category'] = 'CROSS';
      d['wp_id'] = 'CROSS';
      return d;
    });
    melia_data.map((d: any) => {
      d['category'] = 'MELIA';
      return d;
    });
    this.results = [
      ...cross_data,
      ...melia_data,
      ...this.results,
      // ...indicators_data,
    ];
    this.wps = this.results
      .filter((d: any) => d.category == 'WP' && !d.group)
      .sort((a: any, b: any) => a.title.localeCompare(b.title));
    this.wps.push({
      id: 'CROSS',
      title: 'Cross Cutting',
      category: 'CROSS',
      ost_wp: { wp_official_code: 'CROSS' },
    });
    // const partners_result = this.results
    //   .filter((d: any) => d.partners)
    //   .map((d: any) => d.partners)
    //   .flat(1);

    // this.results
    //   .filter((d: any) => d.responsible_organization)
    //   .map((d: any) => d.responsible_organization)
    //   .forEach((element: any) => {
    //     partners_result.push(element);
    //   });

    // this.partners = [
    //   ...new Map(
    //     partners_result.map((item: any) => [item['code'], item])
    //   ).values(),
    // ];
    for (let partner of this.partners) {
      for (let wp of this.wps) {
        const result = await this.getDataForWp(
          wp.id,
          partner.code,
          wp.ost_wp.wp_official_code
        );
        if (result.length) {
          if (!this.partnersData[partner.code])
            this.partnersData[partner.code] = {};
          this.partnersData[partner.code][wp.ost_wp.wp_official_code] = result;
        }
        if (!this.perValuesSammary[wp.ost_wp.wp_official_code])
          this.perValuesSammary[wp.ost_wp.wp_official_code] = {};
        this.period.forEach((element) => {
          if (!this.perValuesSammary[wp.ost_wp.wp_official_code][element.id])
            this.perValuesSammary[wp.ost_wp.wp_official_code][element.id] =
              false;
        });
        result.forEach((item: any) => {
          this.check(
            this.values,
            partner.code,
            wp.ost_wp.wp_official_code,
            item.id
          );

          if (!this.perValues[partner.code]) this.perValues[partner.code] = {};
          if (!this.perValues[partner.code][wp.ost_wp.wp_official_code])
            this.perValues[partner.code][wp.ost_wp.wp_official_code] = {};
          if (
            !this.perValues[partner.code][wp.ost_wp.wp_official_code][item.id]
          )
            this.perValues[partner.code][wp.ost_wp.wp_official_code][item.id] =
              {};

          this.period.forEach((element) => {
            this.perValues[partner.code][wp.ost_wp.wp_official_code][item.id][
              element.id
            ] = false;
          });

          this.period.forEach((element) => {
            if (!this.perAllValues[wp.ost_wp.wp_official_code])
              this.perAllValues[wp.ost_wp.wp_official_code] = {};
            if (!this.perAllValues[wp.ost_wp.wp_official_code][item.id])
              this.perAllValues[wp.ost_wp.wp_official_code][item.id] = {};

            this.perAllValues[wp.ost_wp.wp_official_code][item.id][element.id] =
              false;

            if (!this.sammary[wp.ost_wp.wp_official_code])
              this.sammary[wp.ost_wp.wp_official_code] = {};
            if (!this.sammary[wp.ost_wp.wp_official_code][item.id])
              this.sammary[wp.ost_wp.wp_official_code][item.id] = 0;

            if (!this.sammaryTotal[wp.ost_wp.wp_official_code])
              this.sammaryTotal[wp.ost_wp.wp_official_code] = 0;
          });
        });
      }
      this.loading = false;
    }

    this.partners = this.partners.filter((d: any) => this.partnersData[d.code]);
    for (let wp of this.wps) {
      this.allData[wp.ost_wp.wp_official_code] = await this.getDataForWp(
        wp.id,
        null,
        wp.ost_wp.wp_official_code
      );
    }

    this.savedValues = await this.submissionService.getSavedData(
      this.params.id
    );
  
    this.setvalues(this.savedValues.values, this.savedValues.perValues);
  }
  savedValues: any = null;
  isCenter: boolean = false;
  async ngOnInit() {
    this.params = this.activatedRoute?.snapshot.params;
    this.activatedRoute?.url.subscribe((d) => {
      if (d[3] && d[3]?.path == 'center') this.isCenter = true;
    });

    this.InitData();
    this.period = await this.submissionService.getPeriods();
    this.socket.connect();
    this.socket.on('setDataValues-' + this.params.id, (data: any) => {
      const { partner_code, wp_id, item_id, per_id, value } = data;
      this.changes(partner_code, wp_id, item_id, per_id, value);
    });
    this.socket.on('setDataValue-' + this.params.id, (data: any) => {
      const { partner_code, wp_id, item_id, value } = data;
      this.values[partner_code][wp_id][item_id] = value;
      if (!this.isCenter) this.sammaryCalc();
    });
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }

  setvalues(valuesToSet: any, perValuesToSet: any) {
    if (valuesToSet != null)
      Object.keys(this.values).forEach((code) => {
        Object.keys(this.values[code]).forEach((wp_id) => {
          Object.keys(this.values[code][wp_id]).forEach((item_id) => {
            if (valuesToSet[code] && valuesToSet[code][wp_id])
              this.values[code][wp_id][item_id] =
                +valuesToSet[code][wp_id][item_id];
            // Sum(percentage from each output from each center for each WP) / Sum(total percentage for each WP for each center)
          });
        });
      });
    if (perValuesToSet != null)
      Object.keys(this.perValues).forEach((code) => {
        Object.keys(this.perValues[code]).forEach((wp_id) => {
          Object.keys(this.perValues[code][wp_id]).forEach((item_id) => {
            Object.keys(this.perValues[code][wp_id][item_id]).forEach(
              (per_id) => {
                if (
                  perValuesToSet[code] &&
                  perValuesToSet[code][wp_id] &&
                  perValuesToSet[code][wp_id][item_id]
                )
                  this.perValues[code][wp_id][item_id][per_id] =
                    perValuesToSet[code][wp_id][item_id][per_id];
                // Sum(percentage from each output from each center for each WP) / Sum(total percentage for each WP for each center)
              }
            );
          });
        });
      });

    this.sammaryCalc();
    this.allvalueChange();
  }
  async getDataForWp(
    id: string,
    partner_code: any | null = null,
    official_code = null
  ) {
    let wp_data = this.results.filter((d: any) => {
      if (partner_code)
        return (
          (d.category == 'OUTPUT' ||
            d.category == 'OUTCOME' ||
            d.category == 'CROSS' ||
            // d.category == 'INDICATOR' ||
            d.category == 'MELIA') &&
          (d.group == id || d.wp_id == official_code)
        );
      else
        return (
          (d.category == 'OUTPUT' ||
            d.category == 'OUTCOME' ||
            d.category == 'CROSS' ||
            // d.category == 'INDICATOR' ||
            d.category == 'MELIA') &&
          (d.group == id || d.wp_id == official_code)
        );
    });

    return wp_data;
  }
  addCross() {
    const dialogRef = this.dialog.open(CrossCuttingComponent, {
      data: { initiative_id: this.params.id },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.submissionService.newCross(result);
        await this.InitData();
      }
    });
  }
  async editCross(id: number) {
    const dialogRef = this.dialog.open(CrossCuttingComponent, {
      data: await this.submissionService.getCrossById(id),
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.submissionService.updateCross(id, result);
        await this.InitData();
      }
    });
  }
  deleteCross(id: number) {
    this.dialog
      .open(ConfirmComponent, {
        maxWidth: '400px',
        data: new ConfirmDialogModel(
          'Delete',
          `Are you sure you want to delete this Cross-cutting item?`
        ),
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult == true) {
          let result = await this.submissionService.deleteCross(id);
          if (result) await this.InitData();
        }
      });
  }
  addMelia(wp_official_code: any) {
    const dialogRef = this.dialog.open(MeliaComponent, {
      data: { wp_id: wp_official_code, initiative_id: this.params.id },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.submissionService.newMelia(result);
        await this.InitData();
      }
    });
  }

  async editMelia(id: number) {
    const dialogRef = this.dialog.open(MeliaComponent, {
      data: await this.submissionService.getMeliaById(id),
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.submissionService.updateMelia(id, result);
        await this.InitData();
      }
    });
  }
  async deleteMelia(id: number) {
    this.dialog
      .open(ConfirmComponent, {
        maxWidth: '400px',
        data: new ConfirmDialogModel(
          'Delete',
          `Are you sure you want to delete this MELIA?`
        ),
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult == true) {
          let result = await this.submissionService.deleteMelia(id);
          if (result) await this.InitData();
        }
      });
  }

  viewData(data: any) {
    this.dialog
      .open(ViewDataComponent, {
        maxWidth: '800px',
        data: { data, title: 'View' },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {});
  }

  submit() {
    this.dialog
      .open(ConfirmComponent, {
        maxWidth: '400px',
        data: new ConfirmDialogModel(
          'Submit',
          `Are you sure you want to Submit?`
        ),
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult == true) {
          let result = await this.submissionService.submit(this.params.id, {
            perValues: this.perValues,
            values: this.values,
          });
          if (result) alert('Submited successfully');
        }
      });
  }
}
