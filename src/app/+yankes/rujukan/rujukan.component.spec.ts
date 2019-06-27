import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RujukanComponent } from './rujukan.component';

describe('RujukanComponent', () => {
  let component: RujukanComponent;
  let fixture: ComponentFixture<RujukanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RujukanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RujukanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
