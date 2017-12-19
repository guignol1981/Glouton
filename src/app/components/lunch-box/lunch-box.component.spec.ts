import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LunchBoxComponent } from './lunch-box.component';

describe('LunchBoxComponent', () => {
  let component: LunchBoxComponent;
  let fixture: ComponentFixture<LunchBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LunchBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LunchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
