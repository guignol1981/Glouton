import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinGroupAlertComponent } from './join-group-alert.component';

describe('JoinGroupAlertComponent', () => {
  let component: JoinGroupAlertComponent;
  let fixture: ComponentFixture<JoinGroupAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinGroupAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinGroupAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
