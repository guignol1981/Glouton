import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LunchCardComponent} from './lunch-card.component';

describe('LunchCardComponent', () => {
    let component: LunchCardComponent;
    let fixture: ComponentFixture<LunchCardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LunchCardComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LunchCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
