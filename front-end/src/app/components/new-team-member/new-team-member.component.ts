import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PhasesService } from 'src/app/services/phases.service';
import { UserService } from 'src/app/services/user.service';

export enum ROLES {
  LEAD = 'Leader',
  COORDINATOR = 'Coordinator',
  CONTRIBUTOR = 'Contributor',
}
@Component({
  selector: 'app-new-team-member',
  templateUrl: './new-team-member.component.html',
  styleUrls: ['./new-team-member.component.scss'],
})
export class NewTeamMemberComponent {
  constructor(
    public fb: FormBuilder,
    private dialogRef: MatDialogRef<NewTeamMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any = {},
    private usersService: UserService,
    private phasesService: PhasesService
  ) {}

  confirmation: any = '';
  organizations: any = [];
  users: any = [];
  showConfirm(content: any) {
    console.log(content);
  }
  Roles: any[] = [
    { value: ROLES.LEAD, viewValue: ROLES.LEAD },
    { value: ROLES.COORDINATOR, viewValue: ROLES.COORDINATOR },
    { value: ROLES.CONTRIBUTOR, viewValue: ROLES.CONTRIBUTOR },
  ];
  private atLeastOneValidator = () => {
    return (controlGroup: any) => {
      let controls = controlGroup.controls;
      if (controls) {
        // console.log(controls);
        if (
          controls.email.value == '' &&
          (controls.user_id.value == '' || controls.user_id.value == null)
        ) {
          return {
            atLeastOneRequired: {
              text: 'At least one should be selected',
            },
          };
        }
      }
      return null;
    };
  };

  private organizationValidator = () => {
    return (controlGroup: any) => {
      let controls = controlGroup.controls;
      if (controls) {
        if (
          controls.userRole.value == ROLES.CONTRIBUTOR &&
          (!controls.organizations.value ||
            controls.organizations.value.length < 1)
        ) {
          return {
            organizationsRequired: true,
          };
        } else if (controls.userRole.value != ROLES.CONTRIBUTOR) {
          controls.organizations.value = null;
        }
      }
      return null;
    };
  };

  memberForm: any;
  async populateMemberForm() {
    const activePhase = await this.phasesService.getActivePhase();
    this.organizations = await this.phasesService.getAssignedOrgs(
      activePhase.id,
      this.data.initiative_id
    );
    if (this.data?.member?.user_id) {
      const users: any = await this.usersService.getUsers(
        { user_id: this.data?.member?.user_id },
        1,
        10
      );

      this.users = users.result;
    }
    this.memberForm = this.fb.group({
      email: [
        this.data.role == 'add' ? '' : this.data.member.email,
        [Validators.email],
      ],
      userRole: [
        this.data.role == 'add' ? '' : this.data.member.role,
        Validators.required,
      ],
      user_id: [this.data?.member?.user_id ? this.data?.member?.user_id : null],
      organizations: [
        this.data?.member?.organizations
          ? this.data?.member?.organizations
          : null,
      ],
    });
    this.memberForm.setValidators([
      this.atLeastOneValidator(),
      this.organizationValidator(),
    ]);
  }
  showerror: boolean = false;
  submit() {
    this.memberForm.markAllAsTouched();
    this.memberForm.updateValueAndValidity();
    if (this.memberForm.valid) {
      this.showerror = false;
      this.dialogRef.close({
        role: this.data.role,
        formValue: this.memberForm.value,
      });
    } else {
      this.showerror = true;
    }
  }

  bindValue: any = {
    full_name: 'full_name',
    email: 'email',
  };

  haveSameChar!: boolean;
  searchValue: string = '';
  async search(event: any) {
    this.searchValue = event.term;
    const filters = {
      full_name: this.searchValue,
      email: this.searchValue,
      search: 'teamMember',
    };
    this.users = await this.usersService.getUsersForTeamMember(filters);
    let i = this.searchValue.length;

    for (let user of this.users) {
      if (this.searchValue == user.full_name.substring(0, i)) {
        this.haveSameChar = true;
      } else if (this.searchValue == user.email.substring(0, i)) {
        this.haveSameChar = false;
      }
    }
  }

  async ngOnInit() {
    // this.users = await this.usersService.getUsers();
    // console.log(this.users);
    this.populateMemberForm();
  }
}
