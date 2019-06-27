import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPendapatanComponent } from './dashboard-pendapatan.component';

describe('DashboardPendapatanComponent', () => {
  let component: DashboardPendapatanComponent;
  let fixture: ComponentFixture<DashboardPendapatanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardPendapatanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPendapatanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
