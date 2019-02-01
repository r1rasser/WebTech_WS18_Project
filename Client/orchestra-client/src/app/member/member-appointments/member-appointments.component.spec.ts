import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberAppointmentsComponent } from './member-appointments.component';

describe('MemberAppointmentsComponent', () => {
  let component: MemberAppointmentsComponent;
  let fixture: ComponentFixture<MemberAppointmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberAppointmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
