import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../models/user.model';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;
  constructor(private afAuth: AngularFireAuth, 
    private afs: AngularFirestore, 
    private router: Router, private _snackBar: MatSnackBar) { 
      this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
          if(user) {
            //console.log(user);
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        })
      );
  }

  async googleSignOn() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  async signout() {
    await this.afAuth.auth.signOut();
    return this.router.navigate(['/']);
  }

  private updateUserData({uid, email, displayName, photoURL } : User) {
    const userRef: AngularFirestoreDocument<User> = 
      this.afs.doc(`users/${uid}`);

      const data = {
        uid,
        email,
        displayName,
        photoURL
      };
      return userRef.set(data, { merge: true});
  }

  async loginWithEmail( email: string, password: string) {
    await this.afAuth.auth.signInWithEmailAndPassword(email, password).then((data:any)=> {
      this._snackBar.open('Logged In!', null, { duration:2000});
      console.log('success login with email', data);
      let userData = {uid: data.user.uid, email: data.user.email, displayName: data.user.displayName, photoURL: null };
      console.log('setting user data', userData);
      this.updateUserData(userData);
    }).catch((error:any) => {
      this._snackBar.open(error.message, null, {duration: 5000});
    })
    //this.router.navigate(['admin/list']);
  }

  async registerWithEmail(name:string, email: string, password: string) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((data:any) => {
      let userData = {uid: data.user.uid, email: data.user.email, displayName: name, photoURL: null };
      console.log('setting user data/register', userData);
      this.updateUserData(userData);
    })
    //TODO://
    //this.sendEmailVerification();
  }

  async sendEmailVerification() {
    return await this.afAuth.auth.currentUser.sendEmailVerification();
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
     this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail).then((data:any) =>{
      this._snackBar.open('Reset Email sent', null, {duration: 5000});
     }).catch((error: any ) => {
      this._snackBar.open(error.message, null, {duration: 5000});
     });
  }

}
