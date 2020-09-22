import { Component, OnInit } from '@angular/core';
import { QuotesService } from 'src/app/shared/services/quotes.service';

@Component({
  selector: 'app-quotes-input',
  templateUrl: './quotes-input.component.html',
  styleUrls: ['./quotes-input.component.css']
})
export class QuotesInputComponent implements OnInit {

  constructor(private quotesService: QuotesService) { }

  ngOnInit(): void {
  }

  textValue: string="";

  saveQuote() {
    this.quotesService.addQuote(this.textValue);
    this.textValue = "";
  }

}
