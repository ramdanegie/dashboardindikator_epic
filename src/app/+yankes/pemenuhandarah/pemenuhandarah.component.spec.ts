import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PemenuhandarahComponent } from './pemenuhandarah.component';

describe('PemenuhandarahComponent', () => {
  let component: PemenuhandarahComponent;
  let fixture: ComponentFixture<PemenuhandarahComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PemenuhandarahComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PemenuhandarahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
