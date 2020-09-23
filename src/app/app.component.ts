import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginManualComponent } from './login-manual/login-manual.component';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Quotes';
  loginData:ManualLoginData = {
    id: '',
    password: ''
  }
  constructor(public auth: AuthService, public dialog: MatDialog ) {
    
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(LoginManualComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loginData = result;
    });
  }
}

export interface ManualLoginData {
  id: string;
  password: string;
}
