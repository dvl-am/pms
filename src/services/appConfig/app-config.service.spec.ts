import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from './app-config.service';
import { provideHttpClient } from '@angular/common/http';

describe('AppConfigService', () => {
  let service: AppConfigService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [AppConfigService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AppConfigService);
    httpMock = TestBed.inject(HttpTestingController);
    service.configObj = {
      prefixUrl: 'https://example.com/api/',
      mainUrl: 'endpoint',
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize configuration', (done) => {
    const mockConfig = {
      apiUrl: 'http://localhost:3000',
      env: 'development',
      authenticationUrl: '/auth',
      liquidUrl: '/liquid',
      feedbackSaveUrl: '/feedback/save',
      feedbackUpdate: '/feedback/update',
      feedbackApproveUrl: '/feedback/approve',
      translationFeedbackSaveUrl: '/translation/save',
      translationFeedbackApproveUrl: '/translation/approve',
      detectFileUrl: '/detect',
      languageUrl: '/language',
      bidderInfoUrl: '/bidder/info',
      saveEvalQuestionUrl: '/questions/save',
      questionListUrl: '/questions/list',
      tenderDocument: '/documents/tender'
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    service.ensureInit().then((config) => {
      expect(service.apiUrl).toBe(mockConfig.apiUrl);
      expect(service.env).toBe(mockConfig.env);
      expect(service.configObj).toEqual(mockConfig);
      done();
    });

    const req = httpMock.expectOne('assets/jsons/config.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockConfig);
  });

  it('should throw an error', (done) => {
    service.ensureInit().catch((error) => {
      expect(error).toBeTruthy();
      done();
    });

    const req = httpMock.expectOne('assets/jsons/config.json');
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('Network error'));
  });
  it('should return the correct URL when prefix is used', () => {
    const result = service.getAPIURL(true, 'prefixUrl', 'mainUrl');
    expect(result).toBe('https://example.com/api/endpoint');
  });

  it('should return the correct URL when prefix is not used', () => {
    const result = service.getAPIURL(false, 'prefixUrl', 'mainUrl');
    expect(result).toBe('endpoint');
  });
});
