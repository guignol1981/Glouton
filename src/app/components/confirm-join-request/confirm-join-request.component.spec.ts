import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmJoinRequestComponent } from './confirm-join-request.component';

describe('ConfirmJoinRequestComponent', () => {
  let component: ConfirmJoinRequestComponent;
  let fixture: ComponentFixture<ConfirmJoinRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmJoinRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmJoinRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
