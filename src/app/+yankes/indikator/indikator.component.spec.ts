import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndikatorComponent } from './indikator.component';

describe('IndikatorComponent', () => {
  let component: IndikatorComponent;
  let fixture: ComponentFixture<IndikatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndikatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndikatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
