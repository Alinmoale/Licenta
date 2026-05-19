import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorSidebar } from './doctor-sidebar';

describe('DoctorSidebar', () => {
  let component: DoctorSidebar;
  let fixture: ComponentFixture<DoctorSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorSidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
