import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { LoaderInterceptorService } from './loader-interceptor.service';
import { LoaderService } from '../../services/loader/loader.service';
import { AlertMessageService } from '../alert-message.service';

describe('LoaderInterceptorService', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let loaderService: LoaderService;
  let alertMessageService: AlertMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LoaderService,
        AlertMessageService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoaderInterceptorService,
          multi: true,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    loaderService = TestBed.inject(LoaderService);
    alertMessageService = TestBed.inject(AlertMessageService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('mock-token');
    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush({});
  });

  it('should set loading to true for normal requests', () => {
    spyOn(loaderService, 'setLoading');
    httpClient.get('/test').subscribe();

    expect(loaderService.setLoading).toHaveBeenCalledWith(true);
    const req = httpMock.expectOne('/test');
    req.flush({});
  });

  it('should set loading to false for specific URLs', () => {
    spyOn(loaderService, 'setLoading');
    httpClient.get('/doc/upload').subscribe();
    expect(loaderService.setLoading).toHaveBeenCalledWith(false);

    const req = httpMock.expectOne('/doc/upload');
    req.flush({});
  });

  it('should remove skipLoader header and not set loading', () => {
    spyOn(loaderService, 'setLoading');
    httpClient.get('/test', { headers: { skipLoader: 'true' } }).subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('skipLoader')).toBeFalse();
    expect(loaderService.setLoading).toHaveBeenCalledWith(false);
    req.flush({});
  });

  it('should handle errors and set isError subject', () => {
    spyOn(loaderService.isError, 'next');
    httpClient.get('/test').subscribe({
      error: () => {
        expect(loaderService.isError.next).toHaveBeenCalledWith(jasmine.objectContaining({
          message: 'Http failure response for /test: 500 Server Error',
          status: 500,
        }));
      },
    });

    const req = httpMock.expectOne('/test');
    req.flush({ message: 'Http failure response for /test: 500 Server Error' }, { status: 500, statusText: 'Server Error' });
  });

  it('should modify response body when applicable', () => {
    spyOn(alertMessageService, 'getMessage').and.returnValue('Custom Message');

    httpClient.get('/test').subscribe((response) => {
      expect(response).toEqual(jasmine.objectContaining({ msg: 'Custom Message' }));
    });

    const req = httpMock.expectOne('/test');
    req.flush({ data: 'test' });
  });
});
