import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KunjunganComponent } from './kunjungan.component';

describe('KunjunganComponent', () => {
  let component: KunjunganComponent;
  let fixture: ComponentFixture<KunjunganComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KunjunganComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KunjunganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
