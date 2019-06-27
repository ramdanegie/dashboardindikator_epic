import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardIktComponent } from './dashboard-ikt.component';

describe('DashboardIktComponent', () => {
  let component: DashboardIktComponent;
  let fixture: ComponentFixture<DashboardIktComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardIktComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardIktComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
