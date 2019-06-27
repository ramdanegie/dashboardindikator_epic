import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JumlahkematianComponent } from './jumlahkematian.component';

describe('JumlahkematianComponent', () => {
  let component: JumlahkematianComponent;
  let fixture: ComponentFixture<JumlahkematianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JumlahkematianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JumlahkematianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
