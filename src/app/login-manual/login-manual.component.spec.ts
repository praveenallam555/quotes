import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginManualComponent } from './login-manual.component';

describe('LoginManualComponent', () => {
  let component: LoginManualComponent;
  let fixture: ComponentFixture<LoginManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginManualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
