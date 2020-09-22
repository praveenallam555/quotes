import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotesDisplayComponent } from './quotes-display.component';

describe('QuotesDisplayComponent', () => {
  let component: QuotesDisplayComponent;
  let fixture: ComponentFixture<QuotesDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotesDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotesDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
