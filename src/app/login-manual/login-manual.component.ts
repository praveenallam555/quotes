import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ManualLoginData } from '../app.component';
import { AuthService } from '../shared/services/auth.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-login-manual',
  templateUrl: './login-manual.component.html',
  styleUrls: ['./login-manual.component.css']
})
export class LoginManualComponent implements OnInit {
  userData: ManualLoginData = {
    id:'',
    password:''
  }
  login:boolean = true;
  nameFormControl = new FormControl('', [
    Validators.required
  ]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);
  constructor(
    public dialogRef: MatDialogRef<LoginManualComponent>,
    private auth: AuthService,
    private _snackBar: MatSnackBar) {
      this.auth.user$.subscribe((data) => {
        console.log('user id received', data);
        if(data) {this.dialogRef.close(); }
      })
    }

  cancel(): void {
    this.dialogRef.close();
  }

  ngOnInit() {

  }

  loginOrRegister() {
    if(this.login) {
      this.auth.loginWithEmail(this.nameFormControl.value, this.emailFormControl.value, this.passwordFormControl.value);

    } else {
      this.auth.registerWithEmail(this.emailFormControl.value, this.passwordFormControl.value).then((data:any)=> {
        console.log("register success", data);
        this._snackBar.open('Register Success!', null, {duration: 5000});
        this.login = true;
      }).catch((reason)=>{
        this._snackBar.open(reason.message, null, {duration: 5000});
      })
    }
    this.resetForm();
    
  }

  forgotPassword() {
    this.auth.sendPasswordResetEmail(this.emailFormControl.value).then((data:any) => {
      console.log("password reset sent");
      this.resetForm();
      this._snackBar.open('Password reset Email Sent!!', null, {duration: 5000});
    })
  }

  resetForm() {
    this.nameFormControl.setValue('');
    this.emailFormControl.setValue('');
    this.passwordFormControl.setValue('');
  }
}
