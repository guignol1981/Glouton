import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LunchFormComponent} from './lunch-form.component';

describe('LunchFormComponent', () => {
    let component: LunchFormComponent;
    let fixture: ComponentFixture<LunchFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LunchFormComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LunchFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
