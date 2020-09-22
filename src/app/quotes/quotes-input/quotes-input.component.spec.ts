import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotesInputComponent } from './quotes-input.component';

describe('QuotesInputComponent', () => {
  let component: QuotesInputComponent;
  let fixture: ComponentFixture<QuotesInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotesInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotesInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
