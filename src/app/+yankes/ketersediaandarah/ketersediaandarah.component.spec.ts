import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KetersediaandarahComponent } from './ketersediaandarah.component';

describe('KetersediaandarahComponent', () => {
  let component: KetersediaandarahComponent;
  let fixture: ComponentFixture<KetersediaandarahComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KetersediaandarahComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KetersediaandarahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
