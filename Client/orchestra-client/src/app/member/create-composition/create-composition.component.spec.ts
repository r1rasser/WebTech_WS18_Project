import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCompositionComponent } from './create-composition.component';

describe('CreateCompositionComponent', () => {
  let component: CreateCompositionComponent;
  let fixture: ComponentFixture<CreateCompositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCompositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCompositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
