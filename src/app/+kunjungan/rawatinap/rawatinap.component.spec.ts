import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RawatinapComponent } from './rawatinap.component';

describe('RawatinapComponent', () => {
  let component: RawatinapComponent;
  let fixture: ComponentFixture<RawatinapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RawatinapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawatinapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
