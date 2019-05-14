import { TestBed } from '@angular/core/testing';

import { EventOperationService } from './event-operation.service';

describe('EventOperationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventOperationService = TestBed.get(EventOperationService);
    expect(service).toBeTruthy();
  });
});
