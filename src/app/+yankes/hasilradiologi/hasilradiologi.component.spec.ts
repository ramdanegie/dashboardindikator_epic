import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HasilradiologiComponent } from './hasilradiologi.component';

describe('HasilradiologiComponent', () => {
  let component: HasilradiologiComponent;
  let fixture: ComponentFixture<HasilradiologiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HasilradiologiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HasilradiologiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
