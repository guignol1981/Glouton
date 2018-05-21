import {TestBed, inject} from '@angular/core/testing';

import {LunchService} from './lunch.service';

describe('LunchService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LunchService]
        });
    });

    it('should be created', inject([LunchService], (service: LunchService) => {
        expect(service).toBeTruthy();
    }));
});
