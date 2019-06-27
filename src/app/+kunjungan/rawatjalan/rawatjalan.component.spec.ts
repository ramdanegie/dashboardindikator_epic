import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RawatjalanComponent } from './rawatjalan.component';

describe('RawatjalanComponent', () => {
  let component: RawatjalanComponent;
  let fixture: ComponentFixture<RawatjalanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RawatjalanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawatjalanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
