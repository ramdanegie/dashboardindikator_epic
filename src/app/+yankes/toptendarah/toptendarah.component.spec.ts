import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToptendarahComponent } from './toptendarah.component';

describe('ToptendarahComponent', () => {
  let component: ToptendarahComponent;
  let fixture: ComponentFixture<ToptendarahComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToptendarahComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToptendarahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
