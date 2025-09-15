import { TestBed } from '@angular/core/testing';

import { LoaderService } from './loader.service';
import { HttpClientModule } from '@angular/common/http';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule]
    });
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('set loading true', () => {
    expect(service.setLoading(true))
    expect(service.apiLoader.value).toBeTruthy();
  })

  it('set loading false', () => {
    expect(service.setLoading(false))
    expect(service.apiLoader.value).toBeFalsy();
  })
});
