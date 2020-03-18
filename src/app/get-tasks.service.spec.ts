import { TestBed } from '@angular/core/testing';

import { GetTasksService } from './get-tasks.service';

describe('GetTasksService', () => {
  let service: GetTasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetTasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
