import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ExceptionResponse } from '../../types/exception/excpetion-response';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  private updateCurrentPageSubject = new Subject<number>();
  updateCurrentPage$ = this.updateCurrentPageSubject.asObservable();

  updateCurrentPageOfOwnerMenu(value:number){
    this.updateCurrentPageSubject.next(value);
  }

  private showMenssageErrorSubject = new Subject<ExceptionResponse>();
  showMenssageErrorSubject$ = this.showMenssageErrorSubject.asObservable();

  handlerShowMenssageErrorSubject(exception:ExceptionResponse){
    console.log(exception);
    
    this.showMenssageErrorSubject.next(exception);
  }
}
