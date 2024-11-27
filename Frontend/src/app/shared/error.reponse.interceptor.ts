import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";

export const ErrorResponseInterceptor: HttpInterceptorFn = (req, next) => 
    next(req).pipe(catchError(handleErrorResponse));


function handleErrorResponse(error: HttpErrorResponse) {
    
    const errorResponse = `Error name:${error.name}, ${error.status},${error.statusText}, Error message: ${error.message}`;
   
    return throwError(() => errorResponse);
}