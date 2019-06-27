import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DarahComponent } from './darah.component';

describe('DarahComponent', () => {
  let component: DarahComponent;
  let fixture: ComponentFixture<DarahComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DarahComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DarahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
