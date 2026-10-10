import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { gsap } from 'gsap/gsap-core';
import { UtilityService } from '../../service/utility-service/utility-service';
import { ExceptionResponse } from '../../types/exception/excpetion-response';

@Component({
  selector: 'app-message-error',
  imports: [],
  templateUrl: './message-error.html',
  styleUrl: './message-error.css',
})
export class MessageError {
  showError = signal(false);
  private utilityService = inject(UtilityService);

  exception = signal(<ExceptionResponse> {})

  @ViewChild('main')
  mainDiv!:ElementRef<HTMLElement>;

  @ViewChild('divMenssage')
  divMenssage!:ElementRef<HTMLElement>;

  handlerShowError(exception: ExceptionResponse){
    console.log("Veio");
    this.exception.set(exception);
    this.showError.set(!this.showError());

    if (this.showError()) {
      gsap.set(
        this.mainDiv.nativeElement,
        {display:'flex'}
      )

      gsap.to(
        this.mainDiv.nativeElement,
        {
          opacity:1,
          duration:0.3
        }
      )
      gsap.to(
        this.divMenssage.nativeElement,
        {
          y:'0vh',
          duration: 0.6
        }
      )
      
    }

    else{
      gsap.to(
        this.divMenssage.nativeElement,
        {
          y:'-100vh',
          duration: 0.3
        }
      )
      gsap.to(
        this.mainDiv.nativeElement,
        {
          opacity:0,
          duration:0.6,
          onComplete:() =>{
             gsap.set(
              this.mainDiv.nativeElement,
              {display:'none'}
            )
          }
        }
      )
      
    }
  }

  ngOnInit(){
    this.utilityService.showMenssageErrorSubject$.subscribe((exception) => this.handlerShowError(exception))
  }
}
