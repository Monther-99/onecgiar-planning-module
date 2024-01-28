import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {
  Observable,
  Subject,
  catchError,
  concat,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
} from "rxjs";
import { InitiativesService } from "src/app/services/initiatives.service";
import { SubmissionService } from "src/app/services/submission.service";
// import { AnticipatedYearService } from "src/app/services/anticipated-year.service";
import { MeliaTypeService } from "src/app/services/melia-type.service";
@Component({
  selector: "app-melia",
  templateUrl: "./melia.component.html",
  styleUrls: ["./melia.component.scss"],
})
export class MeliaComponent implements OnInit {
  meliaForm: FormGroup<any> = new FormGroup([]);
  meliaTypes: any[] = [];
  regions: any = [];
  countries: any = [];
  initCountries: any = [];
  coInitCountries: any = [];
  partners: Observable<any[]>;
  partnersInput = new Subject<string>();
  partnersLoading = false;
  initiatives: any = [];
  allResults: any = [];
  results: any = [];
  savedData: any = {};

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private submissionService: SubmissionService,
    private initiativesService: InitiativesService,
    // private anticipatedYearService: AnticipatedYearService,
    private meliaTypeService: MeliaTypeService
  ) {
    this.savedData = data.data;
  }

  private otherInitiativesValidator = () => {
    return (controlGroup: any) => {
      let controls = controlGroup.controls;
      if (controls) {
        if (
          controls.other_initiatives.value == "" ||
          controls.other_initiatives.value == null
        ) {
          return {
            otherInitiativesRequired: {
              text: "This field is mandatory",
            },
          };
        }
      }
      return null;
    };
  };

  private contributionResultsValidator = () => {
    return (controlGroup: any) => {
      let controls = controlGroup.controls;
      if (controls) {
        if (
          controls.contribution_results.value == "" ||
          controls.contribution_results.value == null
        ) {
          return {
            contributionResultsRequired: {
              text: "This field is mandatory",
            },
          };
        }
      }
      return null;
    };
  };

  private partnersValidator = () => {
    return (controlGroup: any) => {
      let controls = controlGroup.controls;
      if (controls) {
        if (controls.partners.value == "" || controls.partners.value == null) {
          return {
            partnersRequired: {
              text: "This field is mandatory",
            },
          };
        }
      }
      return null;
    };
  };

  private geographicScopeValidator = () => {
    return (controlGroup: any) => {
      let controls = controlGroup.controls;
      if (controls) {
        // console.log(controls);
        if (
          controls.geo_scope.value == "" ||
          controls.geo_scope.value == null
        ) {
          return {
            geographicScopeRequired: {
              text: "This field is mandatory",
            },
          };
        }
      }
      return null;
    };
  };

  private initiativeRegionsValidator = () => {
    return (controlGroup: any) => {
      let controls = controlGroup.controls;
      if (controls && this.meliaForm.value.geo_scope == "region") {
        // console.log(controls);
        if (
          controls.initiative_regions.value == "" ||
          controls.initiative_regions.value == null
        ) {
          return {
            initiativeRegionsRequired: {
              text: "This field is mandatory",
            },
          };
        }
      }
      return null;
    };
  };

  private initiativeCountriesValidator = () => {
    return (controlGroup: any) => {
      let controls = controlGroup.controls;
      if (controls && this.meliaForm.value.geo_scope == "region") {
        // console.log(controls);
        if (
          controls.initiative_countries.value == "" ||
          controls.initiative_countries.value == null
        ) {
          return {
            initiativeCountriesRequired: {
              text: "This field is mandatory",
            },
          };
        }
      }
      return null;
    };
  };

  private coInitiativeRegionsValidator = () => {
    return (controlGroup: any) => {
      let controls = controlGroup.controls;
      if (controls && this.meliaForm.value.geo_scope == "region") {
        // console.log(controls);
        if (
          controls.co_initiative_regions.value == "" ||
          controls.co_initiative_regions.value == null
        ) {
          return {
            coInitiativeRegionsRequired: {
              text: "This field is mandatory",
            },
          };
        }
      }
      return null;
    };
  };

  private coInitiativeCountriesValidator = () => {
    return (controlGroup: any) => {
      let controls = controlGroup.controls;
      if (controls && this.meliaForm.value.geo_scope == "region") {
        // console.log(controls);
        if (
          controls.co_initiative_countries.value == "" ||
          controls.co_initiative_countries.value == null
        ) {
          return {
            coInitiativeCountriesRequired: {
              text: "This field is mandatory",
            },
          };
        }
      }
      return null;
    };
  };

  showerror: boolean = false;
  submit() {
    if (this.meliaForm.valid) {
      this.showerror = false;
      this.dialogRef.close(this.meliaForm.value);
    } else {
      this.showerror = true;
    }
  }

  // submit() {
  //   if (this.meliaForm.valid) this.dialogRef.close(this.meliaForm.value);
  // }
  // AnticipatedYear: any;
  async ngOnInit() {
    this.meliaForm = this.fb.group({
      initiative_id: [this.data.initiative_id, Validators.required],
      wp_id: [this.data.wp.ost_wp.wp_official_code, Validators.required],
      initiative_melia_id: [this.savedData?.initiative_melia_id],
      // methodology: [this.savedData?.methodology],
      // experimental: [this.savedData?.experimental],
      // questionnaires: [this.savedData?.questionnaires],
      // completion_year: [this.savedData?.completion_year],
      // management_decisions: [this.savedData?.management_decisions],
      geo_scope: [this.savedData?.geo_scope, Validators.required],
      initiative_regions: [this.savedData?.initiative_regions],
      initiative_countries: [this.savedData?.initiative_countries],
      partners: [this.savedData?.partners, Validators.required],
      // other_initiatives: [this.savedData?.other_initiatives],
      co_initiative_regions: [this.savedData?.co_initiative_regions],
      co_initiative_countries: [this.savedData?.co_initiative_countries],
      contribution_results: [this.savedData?.contribution_results],
    });
    this.loadPartners();
    this.meliaTypes = await this.meliaTypeService.getInitiativeMelias(
      this.data.initiative_id
    );
    if (this.data.cross == true || this.data.wp.id == "CROSS")
      this.meliaTypes = this.meliaTypes.filter((element: any) => {
        if (element.meliaType.HideCrossCutting == false) return element;
      });
    this.regions = await this.submissionService.getRegions();
    this.countries = await this.submissionService.getCountries();
    this.initiatives = await this.initiativesService.getInitiativesOnly();
    this.allResults = await this.submissionService.getToc(
      this.data.initiative_id
    );
    this.fillResultsSelect();
    // this.AnticipatedYear =
    //   await this.anticipatedYearService.getAnticipatedYear();
    // this.AnticipatedYear = this.AnticipatedYear.filter((d: any) => {
    //   return d.phase?.active == true;
    // });
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  // async typeSelected() {
  //   const meliaTypeId = this.meliaForm.value.melia_type;
  //   let initiativeMelia = await this.meliaTypeService.getInitiativeMelia(
  //     this.data.initiative_id,
  //     meliaTypeId
  //   );
  //   if (initiativeMelia) {
  //     console.log(initiativeMelia.other_initiatives);
  //     this.meliaForm.patchValue({
  //       methodology: initiativeMelia.methodology,
  //       experimental: initiativeMelia.experimental,
  //       questionnaires: initiativeMelia.questionnaires,
  //       completion_year: initiativeMelia.completion_year,
  //       management_decisions: initiativeMelia.management_decisions,
  //       other_initiatives: initiativeMelia.other_initiatives,
  //     });
  //   }
  //   this.fillResultsSelect();
  // }

  fillResultsSelect() {
    const selectedStudy = this.meliaForm.value.initiative_melia_id;
    this.results = this.allResults.filter((result: any) => {
      if (this.data.wp.ost_wp.wp_official_code == "CROSS") {
        return (
          result.category == "OUTCOME" ||
          (this.data.show_eoi && result.category == "EOI")
        );
      } else {
        return (
          (result.category == "OUTCOME" ||
            ((selectedStudy == 6 || selectedStudy == 8) &&
              result.category == "OUTPUT")) &&
          (result.group == this.data.wp.id ||
            result.wp_id == this.data.wp.ost_wp.wp_official_code)
        );
      }
    });
  }

  async resultSelected() {
    if (this.meliaForm.get("contribution_results")?.value.length === 0) {
      this.meliaForm.get("partners")?.patchValue(null);
    }

    const resultsIds = this.meliaForm.value.contribution_results;
    const selectedResults = this.results.filter((result: any) =>
      resultsIds.includes(result.id)
    );

    if (!selectedResults.length) return;

    let selectedPartners = this.meliaForm.value.partners;
    let partners = selectedResults
      .map((d: any) => d.partners)
      .reduce((a: any, b: any) => a.concat(b));

    if (selectedPartners) partners = partners.concat(selectedPartners);
    let partnersArray: any[] = [];
    partners.forEach((partner: any) => {
      if (!partnersArray[partner.code]) partnersArray[partner.code] = partner;
    });
    selectedResults.forEach((result: any) => {
      if (
        result.responsible_organization &&
        !partnersArray[result.responsible_organization.code]
      )
        partnersArray[result.responsible_organization.code] =
          result.responsible_organization;
    });

    let selectedInitRegions = this.meliaForm.value.initiative_regions;
    let regions = selectedResults
      .filter((d: any) => d.region)
      .map((d: any) => d.region);
    if (regions && regions.length > 1)
      regions = regions.reduce((a: any, b: any) => a.concat(b));
    if (selectedInitRegions) regions = regions.concat(selectedInitRegions);
    let initRegionsArray: any[] = [];
    regions.forEach((region: any) => {
      if (!initRegionsArray[region.um49Code])
        initRegionsArray[region.um49Code] = region;
    });

    let selectedInitCountries = this.meliaForm.value.initiative_countries;
    let countries = selectedResults
      .filter((d: any) => d.country)
      .map((d: any) => d.country);
    if (countries && countries.length > 1)
      countries = countries.reduce((a: any, b: any) => a.concat(b));
    if (selectedInitCountries)
      countries = countries.concat(selectedInitCountries);
    let initCountriesArray: any[] = [];
    countries.forEach((country: any) => {
      if (!initCountriesArray[country.code])
        initCountriesArray[country.code] = country;
    });

    let CountriesCodes = countries.map((country: any) => country.code);
    let regionsByCountries = [];
    if (CountriesCodes.length)
      regionsByCountries = await this.submissionService.getCountriesRegions(
        CountriesCodes
      );

    regionsByCountries.forEach((region: any) => {
      if (!initRegionsArray[region.um49Code])
        initRegionsArray[region.um49Code] = region;
    });

    let geoScope = initRegionsArray.length ? "region" : "global";

    // this.meliaForm.patchValue({
    //   partners: Object.values(partnersArray),
    //   geo_scope: geoScope,
    //   initiative_regions: initRegionsArray,
    // });
    this.loadInitCountries();
    // this.meliaForm.patchValue({
    //   initiative_countries: initCountriesArray,
    // });
  }

  private loadPartners() {
    this.partners = concat(
      of([]), // default items
      this.partnersInput.pipe(
        distinctUntilChanged(),
        tap(() => (this.partnersLoading = true)),
        switchMap((term) =>
          this.submissionService.searchPartners(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.partnersLoading = false))
          )
        )
      )
    );

    this.meliaForm.setValidators([
      this.partnersValidator(),
      this.geographicScopeValidator(),
      this.initiativeRegionsValidator(),
      this.initiativeCountriesValidator(),
      this.coInitiativeRegionsValidator(),
      this.coInitiativeCountriesValidator(),
      this.contributionResultsValidator(),
      // this.otherInitiativesValidator(),
    ]);
  }

  loadInitCountries() {
    const data = this.meliaForm.value.initiative_regions;
    if (data) {
      const regionsCodes = data.map((region: any) => region.um49Code);
      this.initCountries = this.countries.filter((country: any) => {
        if (country.region)
          return regionsCodes.includes(country.region.um49Code);
        else return false;
      });
    }
  }

  loadCoInitCountries() {
    const data = this.meliaForm.value.co_initiative_regions;
    if (data) {
      const regionsCodes = data.map((region: any) => region.um49Code);
      this.coInitCountries = this.countries.filter((country: any) => {
        if (country.region)
          return regionsCodes.includes(country.region.um49Code);
        else return false;
      });
    }
  }

  compareId(item: any, selected: any) {
    return item.id === selected.id;
  }

  compareCode(item: any, selected: any) {
    return item.code === selected.code;
  }

  compareUmCode(item: any, selected: any) {
    return item.um49Code === selected.um49Code;
  }

  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }

  onToppingRemoved(initiative: any) {
    const toppings = this.meliaForm?.value?.other_initiatives as any[];
    this.removeFirst(toppings, initiative);
    this.meliaForm.controls?.["other_initiatives"].setValue(toppings); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
}
