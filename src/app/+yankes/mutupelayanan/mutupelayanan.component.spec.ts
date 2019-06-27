import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutupelayananComponent } from './mutupelayanan.component';

describe('MutupelayananComponent', () => {
  let component: MutupelayananComponent;
  let fixture: ComponentFixture<MutupelayananComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutupelayananComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutupelayananComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
