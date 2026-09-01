import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollNavigationService {
  private sectionSubject = new Subject<string>();

  section$ = this.sectionSubject.asObservable();

  goTo(section: string): void {
    this.sectionSubject.next(section);
  }


}
