import { TestBed, inject } from '@angular/core/testing';

import { MealImageService } from './meal-image.service';

describe('MealImageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MealImageService]
    });
  });

  it('should be created', inject([MealImageService], (service: MealImageService) => {
    expect(service).toBeTruthy();
  }));
});
