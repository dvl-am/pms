import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, finalize, map, throwError } from "rxjs";
import { LoaderService } from "../../services/loader/loader.service";


@Injectable({
  providedIn: "root",
})
export class LoaderInterceptorService implements HttpInterceptor {
  private totalRequests = 0;
  private url = "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matchedAlert: any = ''
  constructor(private loaderService: LoaderService) { }

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.url = req.url;
    this.totalRequests++;
    const reqHeaders = req.headers.getAll("Interceptor");

      this.loaderService.setLoading(true);
    

    let authToken: string;
  
      // authToken = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRpdGlvbmFsRGF0YSI6eyJpZCI6IjYzOGYwNGQ5MjkzZmFmZjM1ZWI1MWI4NiIsInR3b2ZhY3RvckF1dGhlbnRpY2F0aW9uIjpmYWxzZSwiYWN0aXZlIjp0cnVlLCJmdWxsTmFtZSI6IkFtaXQgTWlzaHJhIiwiZmlyc3ROYW1lIjoiQW1pdCIsImxhc3ROYW1lIjoiTWlzaHJhIiwiZW1haWxJZCI6ImFtaXQubWlzaHJhQGRpZ2l2YXRlbGFicy5jb20iLCJsb2dpbklkIjoiYW1pdG0iLCJyb2xlIjoiQWRtaW4iLCJzdGF0dXMiOiJBIiwicGhvbmVOdW1iZXIiOiIxMjM0NTY3ODkxIiwicGFyZW50VXNlciI6ImFtaXQubWlzaHJhQGRpZ2l2YXRlbGFicy5jb20ifSwib3RwIjpmYWxzZSwidXNlcmlkIjoiYW1pdG0iLCJleHAiOjE3NTc3NDc4Mjl9.NHfXQEFdobKw54Qqlx5e4XyzZ1fIUJv8ITYrMF0jxjA`;
    authToken = `Bearer ${sessionStorage.getItem("userToken")}`;


    let newRequest = req;

    

    const headers = newRequest.headers.set('Authorization', authToken);
    newRequest = newRequest.clone({ headers });
    
    
    return next.handle(newRequest).pipe(
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this.loaderService.setLoading(false);
        }
        setTimeout(() => {
          this.loaderService.setLoading(false);
        }, 3000);
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
         
          if (!Array.isArray(event.body)) {
            const modifiedBody = {
              ...event.body       };
            const modifiedEvent = event.clone({ body: modifiedBody });
            return modifiedEvent;
          }
          return event;
        }
        return event;
      }),
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err) {
            // err.error['msg'] = this.alertMessageService.getMessage(this.alertMessageService.messageList.value, err.error)
            console.log(err.error);
            
          }
        }
        if (reqHeaders && reqHeaders[0] === "false") {
          return throwError(() => err);
        }
        this.loaderService.setLoading(false);
        if( (err.url.includes("/tender-evaluation/tender/get-files") ||
        err.url.includes("/tender-evaluation/bidder-info/search") ||
        err.url.includes("/tender-evaluation/tender-info/search") ||
        err.url.includes("/tender-evaluation/chat-details/search"))

        
        && err.error.msg === "No records found." || err.error.msg ===  "No records found"){
   
        }else{
          this.loaderService.isError.next({ message: err.message, status: err.status })
        }
     
        return throwError(() => err);
      })
    );
  }
}
