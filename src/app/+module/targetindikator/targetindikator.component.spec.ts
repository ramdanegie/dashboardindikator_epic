import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetindikatorComponent } from './targetindikator.component';

describe('TargetindikatorComponent', () => {
  let component: TargetindikatorComponent;
  let fixture: ComponentFixture<TargetindikatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetindikatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetindikatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
