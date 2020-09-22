import { Injectable } from '@angular/core';
import { Quote } from '../models/quote.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import * as uuidv4  from 'uuid/v4';
import * as _ from 'lodash';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  private quotes: Quote[] = [];
  quoteList: Quote[];
  currentUser:User;
  quotesStream: BehaviorSubject<Quote[]> = new BehaviorSubject<Quote[]>(this.quotes);
  constructor(private db: AngularFirestore, private authService:AuthService) { 
    this.authService.user$.subscribe((data:User) => {
      this.currentUser = data;
      if(this.currentUser.uid) {
        this.initiateEvents();
      }
    });
  }

  initiateEvents() {
    this.db.collection('quotes').valueChanges().subscribe((data:Quote[]) => {
      this.quotes = data;
      console.log('refreshed');
      this.quotes.forEach((quote) => {
        this.db.collection('userLikedQuotes', ref => ref.where('id','==',this.currentUser.uid).
            where('likedQuotes','array-contains',quote.id)).get().subscribe(docs => {
              if(docs.size >= 1) {
                console.log(this.currentUser.uid, quote.id);
                docs.forEach(doc => {
                  quote.userFavorite = true;
                })
              }
          });
      });
      // this.db.collection('userLikedQuotes').doc(this.currentUser.uid).get().subscribe(doc => {
      //   if(doc.exists) {
      //     const actualData = doc.data();
      //     console.log(actualData, 'data');
      //   }
      // },error => {
      //   console.log('error in getting user liked posts');
      // });

      this.quotesStream.next(this.quotes);
    });
  }

  addQuote(quote:string) {
    const quote_:Quote = {
      id: uuidv4(),
      content: quote,
      author:this.currentUser.displayName,
      date: new Date().toISOString(),
      favoriteCount: 0,
      photoURL: this.currentUser.photoURL,
      uid: this.currentUser.uid
    };
    //with doc id
    this.db.collection('quotes').doc(quote_.id).set(quote_).then((success) => {
      console.log(success,'success')
    }).catch((error)=>{
      console.log(error,'error');
    }).finally();
    //without doc id
    // this.db.collection('/quotes').add(quote_).then((success) => {
    //   console.log(success,'success')
    // }).catch((error)=>{
    //   console.log(error,'error');
    // }).finally();
    //this.quotesStream.next(this.quotes);
  }
  
  removeQuote(id: string) {
    //with doc id
    this.db.collection('quotes').doc(id).delete().then((data)=> {
      console.log(data,'deleted');
    }).catch((error)=> {
      console.log('delete error');
    })
    //without doc id
    // this.db.collection('/quotes', ref => ref.where('id','==', id)).get().subscribe((data)=> {
    //   data.forEach(x => {
    //     x.ref.delete().then((success)=> {
    //       console.log("delete successful");
    //     }).catch((error) => {
    //       console.log("delete error");
    //     });  
    //   });
    // });
  }

  toggleFavorite(quote:Quote) :Promise<any>{
    if(quote.userFavorite) {
      this.db.collection('quotes').doc(quote.id).set({favoriteCount: quote.favoriteCount - 1}, {merge: true});
       return this.db.collection('userLikedQuotes').doc(this.currentUser.uid).update({
        likedQuotes: firebase.firestore.FieldValue.arrayRemove(quote.id)
      });
    } else {
      this.db.collection('quotes').doc(quote.id).set({ favoriteCount: quote.favoriteCount + 1}, {merge: true});
      return this.db.collection('userLikedQuotes').doc(this.currentUser.uid).set({
        id: this.currentUser.uid, likedQuotes: firebase.firestore.FieldValue.arrayUnion(quote.id)
      }, {merge: true});
    }
  }
}
