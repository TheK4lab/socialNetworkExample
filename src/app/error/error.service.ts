import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private errorListener = new Subject<string>();

  // tslint:disable-next-line: typedef
  getErrorListener() {
    return this.errorListener.asObservable();
  }

  // tslint:disable-next-line: typedef
  throwError(message: string) {
    this.errorListener.next(message);
  }

  // tslint:disable-next-line: typedef
  handleError() {
    this.errorListener.next(null);
  }
}

