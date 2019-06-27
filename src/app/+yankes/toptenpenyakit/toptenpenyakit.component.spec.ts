import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToptenpenyakitComponent } from './toptenpenyakit.component';

describe('ToptenpenyakitComponent', () => {
  let component: ToptenpenyakitComponent;
  let fixture: ComponentFixture<ToptenpenyakitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToptenpenyakitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToptenpenyakitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
