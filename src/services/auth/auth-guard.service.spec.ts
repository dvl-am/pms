import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginService } from '../../services/loginService/login.service';
import { AuthGuard } from './auth-guard.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let loginService: jasmine.SpyObj<LoginService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const loginServiceSpy = jasmine.createSpyObj('LoginService', ['isLoggedIn', 'getUserDetails']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    authGuard = TestBed.inject(AuthGuard);
    loginService = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow activation when user is logged in and has access to the route', () => {
    loginService.isLoggedIn.and.returnValue(true);
    sessionStorage.setItem('pathObj', JSON.stringify({ pathArr: ['dashboard', 'profile'] }));

    const routeMock: any = { snapshot: {} };
    const stateMock: any = { url: '/dashboard' };

    const result = authGuard.canActivate(routeMock, stateMock);

    expect(result).toBeTrue();
  });

  it('should navigate to /home when user is logged in but does not have access to the route', () => {
    loginService.isLoggedIn.and.returnValue(true);
    sessionStorage.setItem('pathObj', JSON.stringify({ pathArr: ['profile'] }));

    const routeMock: any = { snapshot: {} };
    const stateMock: any = { url: '/dashboard' };

    const result = authGuard.canActivate(routeMock, stateMock);

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should navigate to /login with returnUrl when user is not logged in', () => {
    loginService.isLoggedIn.and.returnValue(false);

    const routeMock: any = { snapshot: {} };
    const stateMock: any = { url: '/dashboard' };

    const result = authGuard.canActivate(routeMock, stateMock);

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: stateMock.url } });
  });

  it('should allow loading when user is logged in and has user details', () => {
    loginService.isLoggedIn.and.returnValue(true);
    loginService.getUserDetails.and.returnValue({ name: 'John Doe' });

    const stateMock: any = { url: '/dashboard' };

    const result = authGuard.canLoad(stateMock);

    expect(result).toBeTrue();
  });

  it('should navigate to /login when user is logged in but has no user details', () => {
    loginService.isLoggedIn.and.returnValue(true);
    loginService.getUserDetails.and.returnValue(null);

    const stateMock: any = { url: '/dashboard' };

    const result = authGuard.canLoad(stateMock);

    expect(result).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to /login with returnUrl when user is not logged in (canLoad)', () => {
    loginService.isLoggedIn.and.returnValue(false);

    const stateMock: any = { url: '/dashboard' };

    const result = authGuard.canLoad(stateMock);

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: stateMock.url } });
  });
});
