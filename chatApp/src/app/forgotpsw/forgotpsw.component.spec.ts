import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotpswComponent } from './forgotpsw.component';

describe('ForgotpswComponent', () => {
  let component: ForgotpswComponent;
  let fixture: ComponentFixture<ForgotpswComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotpswComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotpswComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
