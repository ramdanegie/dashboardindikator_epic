import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSdmComponent } from './dashboard-sdm.component';

describe('DashboardSdmComponent', () => {
  let component: DashboardSdmComponent;
  let fixture: ComponentFixture<DashboardSdmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSdmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
