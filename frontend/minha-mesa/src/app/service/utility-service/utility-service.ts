import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  private updateCurrentPageSubject = new Subject<number>();
  updateCurrentPage$ = this.updateCurrentPageSubject.asObservable();

  updateCurrentPageOfOwnerMenu(value:number){
    this.updateCurrentPageSubject.next(value);
  }
}
