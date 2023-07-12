import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { AppSocket } from './socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'planning';
  constructor(private appService: AppService, private socket: AppSocket) {}
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
  period = [
    { id: 1, label: '2022-Q1' },
    { id: 2, label: '2022-Q2' },
    { id: 3, label: '2022-Q3' },
    { id: 4, label: '2022-Q4' },
    { id: 5, label: '2023-Q1' },
    { id: 6, label: '2023-Q2' },
    { id: 7, label: '2023-Q3' },
    { id: 8, label: '2023-Q4' },
  ];
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
  changeCalc(code: any, wp_id: any) {
    console.log('changeCalc', code, wp_id);
    this.socket.emit('setData', {
      perValues: this.perValues,
      values: this.values,
    });
    this.sammaryCalc();
    // localStorage.setItem('initiatives', JSON.stringify(this.values));
  }

  trackGroup(group_id: string, item_id: string) {
    const result = this.result.relations.filter((d: any) => d.to == item_id);
    for (let item of result) {
      return (
        this.result.data.filter((d: any) => d.id == item.from)[0]?.group ==
        group_id
      );
    }
    return false;
  }
  perValues: any = {};
  perValuesSammary: any = {};
  perAllValues: any = {};
  sammaryTotal: any = {};
  changeEnable(
    partner_code: any,
    wp_id: any,
    item_id: any,
    per_id: number,
    event: any
  ) {
    if (!this.perValues[partner_code]) this.perValues[partner_code] = {};
    if (!this.perValues[partner_code][wp_id])
      this.perValues[partner_code][wp_id] = {};
    if (!this.perValues[partner_code][wp_id][item_id])
      this.perValues[partner_code][wp_id][item_id] = {};

    this.perValues[partner_code][wp_id][item_id][per_id] = event.checked;

    this.allvalueChange();

    this.socket.emit('setData', {
      perValues: this.perValues,
      values: this.values,
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
      this.allData[wp.id].forEach((item: any) => {
        this.period.forEach((element) => {
          if (!this.perAllValues[wp.id]) this.perAllValues[wp.id] = {};
          if (!this.perAllValues[wp.id][item.id])
            this.perAllValues[wp.id][item.id] = {};
          this.perAllValues[wp.id][item.id][element.id] = false;
        });
      });
    }
    this.wps.forEach((wp: any) => {
      this.period.forEach((per) => {
        this.perValuesSammary[wp.id][per.id] = false;
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

  async ngOnInit() {
    this.result = await this.appService.get();
    this.wps = this.result.data
      .filter((d: any) => d.category == 'WP')
      .sort((a: any, b: any) => a.title.localeCompare(b.title));

    const partners_result = this.result.data
      .filter((d: any) => d.partners)
      .map((d: any) => d.partners)
      .flat(1);

    this.result.data
      .filter((d: any) => d.responsible_organization)
      .map((d: any) => d.responsible_organization)
      .forEach((element: any) => {
        partners_result.push(element);
      });

    this.partners = [
      ...new Map(
        partners_result.map((item: any) => [item['code'], item])
      ).values(),
    ];

    for (let partner of this.partners) {
      for (let wp of this.wps) {
        const result = await this.getDataForWp(wp.id, partner.code);

        if (result.length) {
          if (!this.partnersData[partner.code])
            this.partnersData[partner.code] = {};
          this.partnersData[partner.code][wp.id] = result;
        }
        if (!this.perValuesSammary[wp.id]) this.perValuesSammary[wp.id] = {};
        this.period.forEach((element) => {
          if (!this.perValuesSammary[wp.id][element.id])
            this.perValuesSammary[wp.id][element.id] = false;
        });
        result.forEach((item: any) => {
          this.check(this.values, partner.code, wp.id, item.id);

          if (!this.perValues[partner.code]) this.perValues[partner.code] = {};
          if (!this.perValues[partner.code][wp.id])
            this.perValues[partner.code][wp.id] = {};
          if (!this.perValues[partner.code][wp.id][item.id])
            this.perValues[partner.code][wp.id][item.id] = {};

          this.period.forEach((element) => {
            this.perValues[partner.code][wp.id][item.id][element.id] = false;
          });

          this.period.forEach((element) => {
            if (!this.perAllValues[wp.id]) this.perAllValues[wp.id] = {};
            if (!this.perAllValues[wp.id][item.id])
              this.perAllValues[wp.id][item.id] = {};

            this.perAllValues[wp.id][item.id][element.id] = false;

            if (!this.sammary[wp.id]) this.sammary[wp.id] = {};
            if (!this.sammary[wp.id][item.id]) this.sammary[wp.id][item.id] = 0;

            if (!this.sammaryTotal[wp.id]) this.sammaryTotal[wp.id] = 0;
          });
        });
      }
    }

    this.partners = this.partners.filter((d: any) => this.partnersData[d.code]);
    for (let wp of this.wps) {
      this.allData[wp.id] = await this.getDataForWp(wp.id);
    }
    this.socket.connect();
    this.socket.on('data', (data: any) => {
      console.log('data comming from Socket', data);
      this.setvalues(data.values, data.perValues);
    });
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }

  setvalues(valuesToSet: any, perValuesToSet: any) {
    console.log('valuesToSet', perValuesToSet);

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
                console.log('perValuesToSet');
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
  async getDataForWp(id: string, partner_code: any | null = null) {
    return this.result.data
      .filter((d: any) => d?.responsible_organization || d?.partners?.length)
      .filter((d: any) => {
        if (partner_code)
          return (
            (d.category == 'OUTPUT' || d.category == 'OUTCOME') &&
            (d.group == id || this.trackGroup(id, d.id)) &&
            (d?.partners.map((d: any) => d.code).indexOf(partner_code) != -1 ||
              d?.responsible_organization?.code == partner_code)
          );
        else
          return (
            (d.category == 'OUTPUT' || d.category == 'OUTCOME') && d.group == id
          );
      });
  }
}
