import { Component, OnInit } from '@angular/core';
import { Quote } from 'src/app/shared/models/quote.model';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { QuotesService } from 'src/app/shared/services/quotes.service';

@Component({
  selector: 'app-quotes-display',
  templateUrl: './quotes-display.component.html',
  styleUrls: ['./quotes-display.component.css']
})
export class QuotesDisplayComponent implements OnInit {
  quotes:Quote[];
  currentUser: User;
  constructor(private quotesService: QuotesService, private auth: AuthService) {
    this.quotesService.quotesStream.subscribe((quotes: Quote[]) => {
      this.quotes = quotes;
    });
    this.auth.user$.subscribe((user => {
      this.currentUser = user;
    }))
  }
  ngOnInit(): void {
  }

  toggleFavorite(quote:Quote, index: number) {
    this.quotesService.toggleFavorite(quote).then(data => {
      if(quote.userFavorite) {
        this.quotes[index].userFavorite = false;
      } else {
        this.quotes[index].userFavorite = true;
      }
    });
  }

  deleteQuote(id:string) {
    this.quotesService.removeQuote(id);
  }

}
