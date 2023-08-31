import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import {
  ConfirmComponent,
  ConfirmDialogModel,
} from './confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, public dialog: MatDialog,private router:Router) {}
  user: any;
  ngOnInit(): void {
    this.router.events.subscribe(e=>{
      this.user = this.authService.getLogedInUser();
    })
  }
  login() {
    this.authService.goToLogin();
  }

  logout() {
    this.dialog
      .open(ConfirmComponent, {
        maxWidth: '400px',
        data: new ConfirmDialogModel(
          'Logout',
          `Are you sure you want to logout?`
        ),
      })
      .afterClosed()
      .subscribe((dialogResult) => {
        if (dialogResult) {
          localStorage.removeItem('access_token');
          this.user = null;
          window.location.href = window.location.href;
        }
      });
  }
}
