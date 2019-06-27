import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPersediaanComponent } from './dashboard-persediaan.component';

describe('DashboardPersediaanComponent', () => {
  let component: DashboardPersediaanComponent;
  let fixture: ComponentFixture<DashboardPersediaanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardPersediaanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPersediaanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
