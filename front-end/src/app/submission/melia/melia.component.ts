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

@Component({
  selector: "app-melia",
  templateUrl: "./melia.component.html",
  styleUrls: ["./melia.component.scss"],
})
export class MeliaComponent implements OnInit {
  meliaForm: FormGroup<any> = new FormGroup([]);
  meliaTypes: any = [];
  regions: any = [];
  countries: any = [];
  initCountries: any = [];
  coInitCountries: any = [];
  partners: Observable<any[]>;
  partnersInput = new Subject<string>();
  partnersLoading = false;
  initiatives: any = [];
  results: any = [];
  savedData: any = {};

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private submissionService: SubmissionService,
    private initiativesService: InitiativesService
  ) {
    this.savedData = data.data;
  }

  private partnersValidator = () => {
    return (controlGroup: any) => {
      let controls = controlGroup.controls;
      if (controls) {
        // console.log(controls);
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
      if (controls) {
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
      if (controls) {
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
      if (controls) {
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
      if (controls) {
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
  async ngOnInit() {
    this.meliaForm = this.fb.group({
      initiative_id: [this.data.initiative_id, Validators.required],
      wp_id: [this.data.wp.ost_wp.wp_official_code, Validators.required],
      melia_type: [this.savedData?.melia_type],
      methodology: [this.savedData?.methodology],
      experimental: [this.savedData?.experimental],
      questionnaires: [this.savedData?.questionnaires],
      completion_year: [this.savedData?.completion_year],
      management_decisions: [this.savedData?.management_decisions],
      geo_scope: [this.savedData?.geo_scope, Validators.required],
      initiative_regions: [this.savedData?.initiative_regions],
      initiative_countries: [this.savedData?.initiative_countries],
      partners: [this.savedData?.partners, Validators.required],
      other_initiatives: [this.savedData?.other_initiatives],
      co_initiative_regions: [this.savedData?.co_initiative_regions],
      co_initiative_countries: [this.savedData?.co_initiative_countries],
      contribution_results: [this.savedData?.contribution_results],
    });
    this.loadPartners();
    this.meliaTypes = await this.submissionService.getMeliaTypes();
    this.regions = await this.submissionService.getRegions();
    this.countries = await this.submissionService.getCountries();
    this.initiatives = await this.initiativesService.getInitiativesOnly();
    this.results = await this.submissionService.getToc(this.data.initiative_id);
    this.results = this.results.filter((result: any) => {
      if (this.data.wp.ost_wp.wp_official_code == "CROSS") {
        return (
          result.category == "OUTCOME" ||
          (this.data.show_eoi && result.category == "EOI")
        );
      } else {
        return (
          result.category == "OUTCOME" &&
          (result.group == this.data.wp.id ||
            result.wp_id == this.data.wp.ost_wp.wp_official_code)
        );
      }
    });
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  async resultSelected(event: any) {
    let selectedResults = this.results.filter((result: any) =>
      event.includes(result.id)
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
    let selectedCoInitRegions = this.meliaForm.value.co_initiative_regions;
    let regions = selectedResults
      .map((d: any) => d.region)
      .reduce((a: any, b: any) => a.concat(b));
    let allInitRegions = regions;
    let allCoInitRegions = regions;
    if (selectedInitRegions)
      allInitRegions = allInitRegions.concat(selectedInitRegions);
    if (selectedCoInitRegions)
      allCoInitRegions = allCoInitRegions.concat(selectedCoInitRegions);
    let initRegionsArray: any[] = [];
    let coInitRegionsArray: any[] = [];
    allInitRegions.forEach((region: any) => {
      if (!initRegionsArray[region.um49Code])
        initRegionsArray[region.um49Code] = region;
    });
    allCoInitRegions.forEach((region: any) => {
      if (!coInitRegionsArray[region.um49Code])
        coInitRegionsArray[region.um49Code] = region;
    });

    let selectedInitCountries = this.meliaForm.value.initiative_countries;
    let selectedCoInitCountries = this.meliaForm.value.co_initiative_countries;
    let countries = selectedResults
      .map((d: any) => d.country)
      .reduce((a: any, b: any) => a.concat(b));
    let allInitCountries = countries;
    let allCoInitCountries = countries;
    if (selectedInitCountries)
      allInitCountries = allInitCountries.concat(selectedInitCountries);
    if (selectedCoInitCountries)
      allCoInitCountries = allCoInitCountries.concat(selectedCoInitCountries);
    let initCountriesArray: any[] = [];
    let coInitCountriesArray: any[] = [];
    allInitCountries.forEach((country: any) => {
      if (!initCountriesArray[country.code])
        initCountriesArray[country.code] = country;
    });
    allCoInitCountries.forEach((country: any) => {
      if (!coInitCountriesArray[country.code])
        coInitCountriesArray[country.code] = country;
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
      if (!coInitRegionsArray[region.um49Code])
        coInitRegionsArray[region.um49Code] = region;
    });

    let geoScope =
      initRegionsArray.length || coInitRegionsArray.length
        ? "region"
        : "global";

    this.meliaForm.patchValue({
      partners: Object.values(partnersArray),
      geo_scope: geoScope,
      initiative_regions: initRegionsArray,
      co_initiative_regions: coInitRegionsArray,
    });

    this.loadInitCountries();
    this.loadCoInitCountries();

    this.meliaForm.patchValue({
      initiative_countries: initCountriesArray,
      co_initiative_countries: coInitCountriesArray,
    });
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
    ]);
  }

  loadInitCountries() {
    const data = this.meliaForm.value.initiative_regions;
    const regionsCodes = data.map((region: any) => region.um49Code);
    this.initCountries = this.countries.filter((country: any) => {
      if (country.region) return regionsCodes.includes(country.region.um49Code);
      else return false;
    });
  }

  loadCoInitCountries() {
    const data = this.meliaForm.value.co_initiative_regions;
    const regionsCodes = data.map((region: any) => region.um49Code);
    this.coInitCountries = this.countries.filter((country: any) => {
      if (country.region) return regionsCodes.includes(country.region.um49Code);
      else return false;
    });
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
}
