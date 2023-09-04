import { Component, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../header.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  container!: ViewContainerRef;

  componentName: any = {
    userManagement: 'user-management',
    parametersSettings: 'parameters-settings',
    announcements: 'announcements',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private headerService: HeaderService
  ) {
    this.headerService.background = 'gray';
  }

  ngOnInit(): void {}
}
