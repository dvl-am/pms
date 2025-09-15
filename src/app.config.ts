import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation ,Route} from '@angular/router';

import { AppConfigService } from './services/appConfig/app-config.service';

import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormGroupDirective } from '@angular/forms';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';


function initConfig(config: AppConfigService) {
  return () => config.ensureInit();
}

function initConstConfig(constConfig: AppConfigService) {
  return () => constConfig.ensureInit();
}
export const appConfig: ApplicationConfig = {
  providers: [
    FormGroupDirective,
    provideRouter(routes, withHashLocation()),
    provideAnimations(),
    provideNoopAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    // { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true },

    { provide: APP_INITIALIZER, useFactory: initConfig, deps: [AppConfigService], multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: initConstConfig,
      deps:  [AppConfigService],
      multi: true,
    },
  ]
};
