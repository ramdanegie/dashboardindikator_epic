import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HasillaboratoriumComponent } from './hasillaboratorium.component';

describe('HasillaboratoriumComponent', () => {
  let component: HasillaboratoriumComponent;
  let fixture: ComponentFixture<HasillaboratoriumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HasillaboratoriumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HasillaboratoriumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
