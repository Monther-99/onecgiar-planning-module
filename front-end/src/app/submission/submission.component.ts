import { Component, OnInit } from "@angular/core";

import { SubmissionService } from "../services/submission.service";
import { AppSocket } from "../socket.service";
import { MatDialog } from "@angular/material/dialog";
import { MeliaComponent } from "./melia/melia.component";
import {
  ConfirmComponent,
  ConfirmDialogModel,
} from "../confirm/confirm.component";
import { CrossCuttingComponent } from "./cross-cutting/cross-cutting.component";
import { ViewDataComponent } from "./view-data/view-data.component";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { ToastrService } from "ngx-toastr";
import { ROLES } from "../components/new-team-member/new-team-member.component";
import { IpsrComponent } from "./ipsr/ipsr.component";
import { PhasesService } from "../services/phases.service";
import { HeaderService } from "../header.service";
import { DeleteConfirmDialogComponent } from "../delete-confirm-dialog/delete-confirm-dialog.component";
import { CenterStatusService } from "./center-status.service";
import { Meta, Title } from "@angular/platform-browser";
import { ConstantService } from "../services/constant.service";
import { InitiativesService } from "../services/initiatives.service";

@Component({
  selector: "app-submission",
  templateUrl: "./submission.component.html",
  styleUrls: ["./submission.component.scss"],
})
export class SubmissionComponent implements OnInit {
  title = "planning";

  columnsToDisplay: string[] = ["name", "email"];
  constructor(
    private submissionService: SubmissionService,
    private phasesService: PhasesService,
    private socket: AppSocket,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private AuthService: AuthService,
    private toastrService: ToastrService,
    private headerService: HeaderService,
    private centerStatusService: CenterStatusService,
    private title2: Title,
    private meta: Meta,
    private constantsService: ConstantService,
    private initiativeService: InitiativesService
  ) {
    this.headerService.background =
      "linear-gradient(to  bottom, #0F212F, #0E1E2B)";
    this.headerService.backgroundNavMain =
      "linear-gradient(to  bottom, #436280, #30455B)";
    this.headerService.backgroundUserNavButton =
      "linear-gradient(to  bottom, #436280, #30455B)";
    this.headerService.backgroundFooter =
      "linear-gradient(to top right, #436280, #263749)";
  }
  user: any;
  data: any = [];
  wps: any = [];
  partners: any = [];
  result: any;
  partnersData: any = {};
  sammary: any = {};
  allData: any = {};
  values: any = {};
  displayValues: any = {};
  summaryBudgets: any = {};
  summaryBudgetsTotal: any = {};
  summaryBudgetsAllTotal: any = 0;
  wp_budgets: any = {};
  budgetValues: any = {};
  displayBudgetValues: any = {};
  totals: any = {};
  errors: any = {};
  period: Array<any> = [];
  toggleValues: any = {};
  toggleSummaryValues: any = {};
  noValuesAssigned: any = {};
  partnersStatus: any = {};
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
  async changeCalc(partner_code: any, wp_id: any, item_id: any, type: string) {
    if (this.timeCalc) clearTimeout(this.timeCalc);
    this.timeCalc = setTimeout(async () => {
      let percentValue;
      let budgetValue;
      let isActualValues = this.toggleValues[partner_code][wp_id];

      if (type == "percent") {
        percentValue = isActualValues
          ? this.values[partner_code][wp_id][item_id]
          : this.displayValues[partner_code][wp_id][item_id];
        budgetValue = this.budgetValue(
          percentValue,
          this.wp_budgets[partner_code][wp_id]
        );
      } else {
        budgetValue = isActualValues
          ? this.budgetValues[partner_code][wp_id][item_id]
          : this.displayBudgetValues[partner_code][wp_id][item_id];
        percentValue = this.percentValue(
          budgetValue,
          this.wp_budgets[partner_code][wp_id]
        );
      }
      this.values[partner_code][wp_id][item_id] = percentValue;
      this.displayValues[partner_code][wp_id][item_id] =
        Math.round(percentValue);
      this.budgetValues[partner_code][wp_id][item_id] = budgetValue;
      this.displayBudgetValues[partner_code][wp_id][item_id] =
        Math.round(budgetValue);

      const result = await this.submissionService.saveResultValue(
        this.params.id,
        {
          partner_code: partner_code,
          wp_id: wp_id,
          item_id: item_id,
          percent_value: percentValue,
          budget_value: budgetValue,
          no_budget: this.noValuesAssigned[partner_code][wp_id][item_id],
        }
      );
      if (result)
        this.socket.emit("setDataValue", {
          id: this.params.id,
          partner_code,
          wp_id,
          item_id,
          value: percentValue,
        });
      this.sammaryCalc();
    }, 500);

    // localStorage.setItem('initiatives', JSON.stringify(this.values));
  }

  budgetTime: any;
  async wpBudgetChange(partner_code: any, wp_id: any, budget: any) {
    if (this.budgetTime) clearTimeout(this.budgetTime);
    this.budgetTime = setTimeout(async () => {
      const result = await this.submissionService.saveWpBudget(this.params.id, {
        partner_code,
        wp_id,
        budget,
      });

      this.refreshValues(partner_code, wp_id);

      if (result)
        this.socket.emit("setDataBudget", {
          id: this.params.id,
          partner_code,
          wp_id,
          budget,
        });
      this.sammaryCalc();
    }, 500);
  }

  percentValue(value: number, totalBudget: number) {
    return (value / totalBudget) * 100;
  }

  budgetValue(value: number, totalBudget: number) {
    return (value * totalBudget) / 100;
  }

  roundNumber(value: number) {
    return Math.round(value);
  }

  toggleActualValues(partner_code: any, wp_official_code: any) {
    this.toggleValues[partner_code][wp_official_code] =
      !this.toggleValues[partner_code][wp_official_code];
  }

  toggleSummaryActualValues(wp_official_code: any) {
    this.toggleSummaryValues[wp_official_code] =
      !this.toggleSummaryValues[wp_official_code];
  }

  toggleNoValues(partner_code: any, wp_official_code: any, item_id: any) {
    if (!!this.noValuesAssigned[partner_code][wp_official_code][item_id]) {
      this.noValuesAssigned[partner_code][wp_official_code][item_id] = 0;
    }
    this.values[partner_code][wp_official_code][item_id] = 0;
    this.displayValues[partner_code][wp_official_code][item_id] = 0;
    this.changeCalc(partner_code, wp_official_code, item_id, "percent");
  }

  refreshValues(partner_code: any, wp_id: any) {
    Object.keys(this.values[partner_code][wp_id]).forEach((item_id) => {
      let budgetValue = this.budgetValue(
        this.values[partner_code][wp_id][item_id],
        this.wp_budgets[partner_code][wp_id]
      );
      this.budgetValues[partner_code][wp_id][item_id] = budgetValue;
      this.displayBudgetValues[partner_code][wp_id][item_id] =
        Math.round(budgetValue);
    });
  }

  finalPeriodVal(period_id: any) {
    return this.wps
      .map(
        (wp: any) =>
          this.perValuesSammary[wp.ost_wp.wp_official_code][period_id]
      )
      .reduce((a: any, b: any) => a || b);
  }

  finalItemPeriodVal(wp_id: any, period_id: any) {
    let periods = this.allData[wp_id].map(
      (item: any) => this.perAllValues[wp_id][item.id][period_id]
    );
    if (periods.length) return periods.reduce((a: any, b: any) => a || b);
    else return false;
  }

  perValues: any = {};
  perValuesSammary: any = {};
  perAllValues: any = {};
  sammaryTotal: any = {};
  checkComplete(organization_code: number) {
    if (this.initiative_data.center_status) {
      return (
        this.initiative_data.center_status.filter(
          (d: any) => d.organization_code == organization_code
        )[0]?.status == 1
      );
    } else return false;
  }
  partnerStatusChange(event: any, partnerCode: number) {
    let index = 0;
    if (!this.isCenter) {
      index =
        this.partners
          .map((d: any) => {
            return d.id;
          })
          .indexOf(partnerCode) + 1;
    } else {
      index = this.partners
        .map((d: any) => {
          return d.id;
        })
        .indexOf(partnerCode);
    }
    this.InitData();
    this.selectedTabIndex = index;
  }

  tabChanged(organization: any) {
    this.partners.map((d: any) => {
      if (d.name == organization?.tab?.textLabel) this.organizationSelected = d;
    });
  }

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
    if (!!this.noValuesAssigned[partner_code][wp_id][item_id]) {
      this.noValuesAssigned[partner_code][wp_id][item_id] = 0;
    }
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
    if (
      !Object.values(this.perValues[partner_code][wp_id][item_id]).includes(
        true
      )
    ) {
      this.values[partner_code][wp_id][item_id] = 0;
      this.displayValues[partner_code][wp_id][item_id] = 0;
      this.changeCalc(partner_code, wp_id, item_id, "percent");
    }
    if (result)
      this.socket.emit("setDataValues", {
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
    this.summaryBudgets = {};
    this.summaryBudgetsTotal = {};

    Object.keys(this.budgetValues).forEach((partner_code) => {
      Object.keys(this.budgetValues[partner_code]).forEach((wp_id) => {
        if (!this.summaryBudgets[wp_id]) this.summaryBudgets[wp_id] = {};
        if (!this.summaryBudgetsTotal[wp_id])
          this.summaryBudgetsTotal[wp_id] = 0;
        Object.keys(this.budgetValues[partner_code][wp_id]).forEach(
          (item_id) => {
            if (!this.summaryBudgets[wp_id][item_id])
              this.summaryBudgets[wp_id][item_id] = 0;
            this.summaryBudgets[wp_id][item_id] +=
              +this.budgetValues[partner_code][wp_id][item_id];
            this.summaryBudgetsTotal[wp_id] +=
              +this.budgetValues[partner_code][wp_id][item_id];
          }
        );
      });
    });

    this.summaryBudgetsAllTotal = Object.values(
      this.summaryBudgetsTotal
    ).reduce((a: any, b: any) => a + b);

    Object.keys(this.summaryBudgets).forEach((wp_id) => {
      Object.keys(this.summaryBudgets[wp_id]).forEach((item_id) => {
        if (this.summaryBudgetsTotal[wp_id]) {
          this.sammary[wp_id][item_id] = this.percentValue(
            this.summaryBudgets[wp_id][item_id],
            this.summaryBudgetsTotal[wp_id]
          );
        }
      });
    });

    Object.keys(this.values).forEach((code) => {
      Object.keys(this.values[code]).forEach((wp_id) => {
        let total = 0;
        Object.keys(this.values[code][wp_id]).forEach((d) => {
          total += +this.values[code][wp_id][d];
        });
        if (total > 100) {
          this.errors[code][wp_id] =
            "total percentage cannot be over 100 percent";
          this.toggleValues[code][wp_id] = true;
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

    this.sammaryTotal["CROSS"] = 0;
    this.sammaryTotal["IPSR"] = 0;
    Object.keys(this.sammary).forEach((wp_id) => {
      this.sammaryTotal[wp_id] = 0;
      Object.keys(this.sammary[wp_id]).forEach((item_id) => {
        if (totalWp[wp_id][item_id])
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
    this.selectedTabIndex = 0;
  }
  results: any;
  loading = true;
  params: any;
  ipsrs_data: any;
  initiative_data: any = {};
  ipsr_value_data: any;
  phase: any;
  async InitData() {
    this.loading = true;
    this.wpsTotalSum = 0;
    this.perValues = {};
    this.perValuesSammary = {};
    this.perAllValues = {};
    this.sammaryTotal = {};
    this.data = [];
    this.wps = [];
    this.partnersData = {};
    this.sammary = {};
    this.summaryBudgets = {};
    this.summaryBudgetsTotal = {};
    this.wp_budgets = {};
    this.toggleValues = {};
    this.budgetValues = {};
    this.budgetValues = {};
    this.displayBudgetValues = {};
    this.allData = {};
    this.values = {};
    this.displayValues = {};
    this.totals = {};
    this.errors = {};
    this.noValuesAssigned = {};
    this.partnersStatus = {};

    this.results = await this.submissionService.getToc(this.params.id);
    const melia_data = await this.submissionService.getMeliaByInitiative(
      this.params.id
    );
    this.ipsrs_data = await this.submissionService.getIpsrs();
    this.ipsr_value_data = await this.submissionService.getIpsrByInitiative(
      this.initiative_data.id
    );
    const cross_data = await this.submissionService.getCrossByInitiative(
      this.params.id
    );
    this.initiative_data = await this.submissionService.getInitiative(
      this.params.id
    );

    this.wp_budgets = await this.submissionService.getWpBudgets(this.params.id);

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
      d["category"] = "CROSS";
      d["wp_id"] = "CROSS";
      return d;
    });
    melia_data.map((d: any) => {
      d["category"] = "MELIA";
      return d;
    });
    this.ipsr_value_data.map((d: any) => {
      d["category"] = "IPSR";
      d["wp_id"] = "IPSR";
      return d;
    });
    this.results = [
      ...cross_data,
      ...melia_data,
      ...this.ipsr_value_data,
      ...this.results,
      // ...indicators_data,
    ];
    this.wps = this.results
      .filter((d: any) => {
        if (d.category == 'WP')
          d.title = d.ost_wp.acronym + ': ' + d.ost_wp.name;
        return d.category == 'WP' && !d.group;
      })
      .sort((a: any, b: any) => a.title.localeCompare(b.title));
    this.wps.unshift({
      id: "CROSS",
      title: "Cross Cutting",
      category: "CROSS",
      ost_wp: { wp_official_code: "CROSS" },
    });

    this.wps.push({
      id: "IPSR",
      title: "Innovation packages & Scalling Readiness",
      category: "IPSR",
      ost_wp: { wp_official_code: "IPSR" },
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
      if (!this.wp_budgets[partner.code]) this.wp_budgets[partner.code] = {};
      if (!this.budgetValues[partner.code])
        this.budgetValues[partner.code] = {};
      if (!this.displayBudgetValues[partner.code])
        this.displayBudgetValues[partner.code] = {};
      if (!this.toggleValues[partner.code])
        this.toggleValues[partner.code] = {};
      if (!this.noValuesAssigned[partner.code])
        this.noValuesAssigned[partner.code] = {};
      if (!this.partnersStatus[partner.code])
        this.partnersStatus[partner.code] = this.checkComplete(partner.code);

      for (let wp of this.wps) {
        if (!this.wp_budgets[partner.code][wp.ost_wp.wp_official_code])
          this.wp_budgets[partner.code][wp.ost_wp.wp_official_code] = null;
        if (!this.toggleValues[partner.code][wp.ost_wp.wp_official_code])
          this.toggleValues[partner.code][wp.ost_wp.wp_official_code] = false;
        if (!this.budgetValues[partner.code][wp.ost_wp.wp_official_code])
          this.budgetValues[partner.code][wp.ost_wp.wp_official_code] = {};
        if (!this.displayBudgetValues[partner.code][wp.ost_wp.wp_official_code])
          this.displayBudgetValues[partner.code][wp.ost_wp.wp_official_code] =
            {};
        if (!this.noValuesAssigned[partner.code][wp.ost_wp.wp_official_code])
          this.noValuesAssigned[partner.code][wp.ost_wp.wp_official_code] = {};
        if (!this.summaryBudgets[wp.ost_wp.wp_official_code])
          this.summaryBudgets[wp.ost_wp.wp_official_code] = {};
        if (!this.summaryBudgetsTotal[wp.ost_wp.wp_official_code])
          this.summaryBudgetsTotal[wp.ost_wp.wp_official_code] = 0;

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
          if (item.category != "OUTCOME") {
            this.check(
              this.values,
              partner.code,
              wp.ost_wp.wp_official_code,
              item.id
            );
            this.check(
              this.displayValues,
              partner.code,
              wp.ost_wp.wp_official_code,
              item.id
            );
          }
          this.budgetValues[partner.code][wp.ost_wp.wp_official_code][item.id] =
            null;
          this.displayBudgetValues[partner.code][wp.ost_wp.wp_official_code][
            item.id
          ] = null;
          this.noValuesAssigned[partner.code][wp.ost_wp.wp_official_code][
            item.id
          ] = false;
          if (!this.summaryBudgets[wp.ost_wp.wp_official_code][item.id])
            this.summaryBudgets[wp.ost_wp.wp_official_code][item.id] = 0;

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

    this.setvalues(
      this.savedValues.values,
      this.savedValues.perValues,
      this.savedValues.no_budget
    );

    this.title2.setTitle("Manage initiative activities");
    this.meta.updateTag({
      name: "description",
      content: "Manage initiative activities",
    });

    console.log(this.initiative_data.official_code);
  }
  savedValues: any = null;
  isCenter: boolean = false;
  selectedTabIndex: number = 0;
  canSubmit: any;
  InitiativeUsers: any;
  leaders: any[] = [];
  organizationSelected: any = "";
  async ngOnInit() {
    this.user = this.AuthService.getLoggedInUser();
    this.params = this.activatedRoute?.snapshot.params;
    this.phase = await this.phasesService.getActivePhase();
    this.InitiativeUsers = await this.initiativeService.getInitiativeUsers(
      this.params.id
    );
    this.InitiativeUsers.map((d: any) => {
      if (d.role == "Leader") this.leaders.push(d.user);
    });
    let partners: any = await this.phasesService.getAssignedOrgs(
      this.phase.id,
      this.params.id
    );
    if (partners.length < 1) {
      partners = await this.submissionService.getOrganizations();
    }
    this.initiative_data = await this.submissionService.getInitiative(
      this.params.id
    );
    const roles = this.initiative_data.roles.filter(
      (d: any) => d.user_id == this.user.id
    );
    if (roles.length) {
      this.isCenter = true;
      if (
        roles[0].role == ROLES.LEAD ||
        roles[0].role == ROLES.COORDINATOR ||
        this.user.role == "admin"
      ) {
        this.partners = partners;
        this.isCenter = false;
      } else {
        if (roles[0].organizations.length) {
          this.partners = roles[0].organizations;
        } else {
          this.toastrService.error(
            "You are not assigned to this initiative, so please contact the leader to  give you access",
            "Access denied"
          );
          this.router.navigate(["denied"]);
        }
      }
    } else {
      if (this.user.role == "admin") this.partners = partners;
      else {
        this.router.navigate(["denied"]);
        return;
      }
    }
    this.activatedRoute?.url.subscribe((d) => {
      if (d[3] && d[3]?.path == "center") this.isCenter = true;
    });

    this.organizationSelected = this.partners[0];

    console.log(this.organizationSelected);

    this.InitData();
    this.period = await this.submissionService.getPeriods(this.phase.id);
    this.socket.connect();
    this.socket.on("setDataValues-" + this.params.id, (data: any) => {
      const { partner_code, wp_id, item_id, per_id, value } = data;
      this.changes(partner_code, wp_id, item_id, per_id, value);
    });
    this.socket.on("setDataValue-" + this.params.id, (data: any) => {
      const { partner_code, wp_id, item_id, value } = data;
      this.values[partner_code][wp_id][item_id] = value;
      this.displayValues[partner_code][wp_id][item_id] = Math.round(value);
      let budgetValue = this.budgetValue(
        value,
        this.wp_budgets[partner_code][wp_id]
      );
      this.budgetValues[partner_code][wp_id][item_id] = budgetValue;
      this.displayBudgetValues[partner_code][wp_id][item_id] =
        Math.round(budgetValue);
      if (!this.isCenter) this.sammaryCalc();
    });
    this.socket.on("setDataBudget-" + this.params.id, (data: any) => {
      const { partner_code, wp_id, budget } = data;
      this.wp_budgets[partner_code][wp_id] = budget;
      this.refreshValues(partner_code, wp_id);
    });
    this.canSubmit = await this.constantsService.getSubmitStatus();

    console.log(this.partners);
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }

  setvalues(valuesToSet: any, perValuesToSet: any, noBudget: any) {
    if (valuesToSet != null)
      Object.keys(this.values).forEach((code) => {
        Object.keys(this.values[code]).forEach((wp_id) => {
          Object.keys(this.values[code][wp_id]).forEach((item_id) => {
            if (
              valuesToSet[code] &&
              valuesToSet[code][wp_id] &&
              valuesToSet[code][wp_id][item_id]
            ) {
              let percentValue = +valuesToSet[code][wp_id][item_id];
              let budgetValue = this.budgetValue(
                percentValue,
                this.wp_budgets[code][wp_id]
              );
              this.values[code][wp_id][item_id] = percentValue;
              this.displayValues[code][wp_id][item_id] =
                Math.round(percentValue);
              this.budgetValues[code][wp_id][item_id] = budgetValue;
              this.displayBudgetValues[code][wp_id][item_id] =
                Math.round(budgetValue);
            } else {
              this.values[code][wp_id][item_id] = 0;
              this.displayValues[code][wp_id][item_id] = 0;
              this.budgetValues[code][wp_id][item_id] = 0;
              this.displayBudgetValues[code][wp_id][item_id] = 0;
            }
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
    if (noBudget != null)
      Object.keys(this.noValuesAssigned).forEach((code) => {
        Object.keys(this.noValuesAssigned[code]).forEach((wp_id) => {
          Object.keys(this.noValuesAssigned[code][wp_id]).forEach((item_id) => {
            if (
              noBudget[code] &&
              noBudget[code][wp_id] &&
              noBudget[code][wp_id][item_id]
            ) {
              this.noValuesAssigned[code][wp_id][item_id] =
                noBudget[code][wp_id][item_id];
            } else {
              this.noValuesAssigned[code][wp_id][item_id] = false;
            }
          });
        });
      });
    this.sammaryCalc();
    this.allvalueChange();
  }

  checkEOI(category: any) {
    return this.phase?.show_eoi ? category == "EOI" : false;
  }
  async getDataForWp(
    id: string,
    partner_code: any | null = null,
    official_code = null
  ) {
    let wp_data = this.results.filter((d: any) => {
      if (partner_code)
        return (
          (d.category == "OUTPUT" ||
            d.category == "OUTCOME" ||
            this.checkEOI(d.category) ||
            d.category == "CROSS" ||
            d.category == "IPSR" ||
            d.category == "MELIA") &&
          (d.group == id ||
            d.wp_id == official_code ||
            (official_code == "CROSS" && this.checkEOI(d.category)))
        );
      else
        return (
          ((d.category == "OUTPUT" ||
            d.category == "OUTCOME" ||
            this.checkEOI(d.category) ||
            d.category == "CROSS" ||
            d.category == "IPSR" ||
            d.category == "MELIA") &&
            (d.group == id || d.wp_id == official_code)) ||
          (official_code == "CROSS" && this.checkEOI(d.category))
        );
    });

    wp_data.sort(this.compare);

    return wp_data;
  }

  compare(a: any, b: any) {
    if (a.category == "OUTPUT" && b.category == "OUTCOME") return -1;
    if (b.category == "OUTPUT" && a.category == "OUTCOME") return 1;
    return 0;
  }

  addCross() {
    const dialogRef = this.dialog.open(CrossCuttingComponent, {
      data: { initiative_id: this.params.id },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.submissionService.newCross(result);
        await this.InitData();
        this.toastrService.success("Added successfully");
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
      .open(DeleteConfirmDialogComponent, {
        data: {
          title: "Delete",
          message: `Are you sure you want to delete this Cross-cutting item?`,
        },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult == true) {
          let result = await this.submissionService.deleteCross(id);
          if (result) await this.InitData();
          this.toastrService.success("Deleted successfully");
        }
      });
  }
  addMelia(wp: any) {
    const dialogRef = this.dialog.open(MeliaComponent, {
      autoFocus: false,
      data: {
        wp: wp,
        initiative_id: this.params.id,
        show_eoi: this.phase?.show_eoi,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.submissionService.newMelia(result);
        await this.InitData();
        this.toastrService.success("Added successfully");
      }
    });
  }

  async setIPSR(wp_official_code: any) {
    const dialogRef = this.dialog.open(IpsrComponent, {
      data: {
        wp_id: wp_official_code,
        initiative_id: this.params.id,
        ipsrs: this.ipsrs_data,
        values: await this.submissionService.getIpsrByInitiative(
          this.initiative_data.id
        ),
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.submissionService.saveIPSR(result);
        await this.InitData();
      }
    });
  }

  async editMelia(id: number, wp: any) {
    const dialogRef = this.dialog.open(MeliaComponent, {
      data: {
        initiative_id: this.params.id,
        wp: wp,
        show_eoi: this.phase?.show_eoi,
        data: await this.submissionService.getMeliaById(id),
      },
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
      .open(DeleteConfirmDialogComponent, {
        data: {
          title: "Delete",
          message: `Are you sure you want to delete this MELIA?`,
        },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult == true) {
          let result = await this.submissionService.deleteMelia(id);
          if (result) await this.InitData();
          this.toastrService.success("Deleted successfully");
        }
      });
  }

  viewData(data: any) {
    this.dialog
      .open(ViewDataComponent, {
        maxWidth: "800px",
        data: { data, title: "View" },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {});
  }

  submit() {
    ///////////////////
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        data: {
          title: "Submit",
          message: `Are you sure you want to submit?`,
          svg: `../../assets/shared-image/apply.png`,
        },
      })
      .afterClosed()
      .subscribe(async (dialogResult) => {
        if (dialogResult == true) {
          if (this.validate()) {
            this.loading = true;
            let result = await this.submissionService.submit(this.params.id, {
              phase_id: this.phase.id,
            });
            if (result) {
              this.toastrService.success("Data Submitted successfully");
              this.router.navigate([
                "initiative",
                this.initiative_data.id,
                this.initiative_data.official_code,
                "submited-versions",
              ]);
            }
            this.loading = false;
          }
        }
      });
  }

  validate() {
    let valid = true;
    Object.keys(this.totals).forEach((partner_code) => {
      Object.keys(this.totals[partner_code]).forEach((wp_id) => {
        if (this.totals[partner_code][wp_id] != 100) valid = false;
      });
    });

    if (!valid) {
      this.toastrService.error(
        "The subtotal of all percentages should equal 100%",
        "Submission failed"
      );
      return valid;
    }

    Object.keys(this.partnersData).forEach((partner_code) => {
      Object.keys(this.partnersData[partner_code]).forEach((wp_id) => {
        this.partnersData[partner_code][wp_id].forEach((item: any) => {
          if (item.category != "EOI" && item.category != "OUTCOME") {
            let perChecked = Object.values(
              this.perValues[partner_code][wp_id][item.id]
            ).reduce((a: any, b: any) => a || b);
            if (
              perChecked &&
              !this.values[partner_code][wp_id][item.id] &&
              !this.noValuesAssigned[partner_code][wp_id][item.id]
            )
              valid = false;
          }
        });
      });
    });

    if (!valid) {
      this.toastrService.error(
        "There is a checked items but not budgeted",
        "Submission failed"
      );
      return valid;
    }

    return valid;
  }

  validateCenter(partner_code: any) {
    let valid = true;
    Object.keys(this.totals[partner_code]).forEach((wp_id) => {
      if (this.totals[partner_code][wp_id] != 100) valid = false;
    });

    if (!valid) {
      this.toastrService.error(
        "The subtotal of all percentages should equal 100%",
        "Complete failed"
      );
      this.centerStatusService.validPartner.next(valid);
      return;
    }

    Object.keys(this.partnersData[partner_code]).forEach((wp_id) => {
      this.partnersData[partner_code][wp_id].forEach((item: any) => {
        if (item.category != "EOI" && item.category != "OUTCOME") {
          let perChecked = Object.values(
            this.perValues[partner_code][wp_id][item.id]
          ).reduce((a: any, b: any) => a || b);
          if (
            perChecked &&
            !this.values[partner_code][wp_id][item.id] &&
            !this.noValuesAssigned[partner_code][wp_id][item.id]
          )
            valid = false;
        }
      });
    });

    if (!valid) {
      this.toastrService.error(
        "There is a checked items but not budgeted",
        "Complete failed"
      );
      this.centerStatusService.validPartner.next(valid);
      return;
    }
    this.centerStatusService.validPartner.next(valid);
  }
}
