import { TestBed } from '@angular/core/testing';

import { TaskSyncService } from './task-sync.service';

describe('TaskSyncService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskSyncService = TestBed.get(TaskSyncService);
    expect(service).toBeTruthy();
  });
});
