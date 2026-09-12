import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserRegister } from '../user-register/user-register';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-user-auth',
  imports: [RouterLink, UserRegister, NgClass],
  templateUrl: './user-auth.html',
  styleUrl: './user-auth.css',
})
export class UserAuth {
  private router = inject(Router);
  constructor(private route: ActivatedRoute){};

  //0 = login, 1 = register
  formActive = signal(0);
  ngOnInit(){
    
    this.route.queryParamMap.subscribe(params => {
      
      const typeForm = params.get('q');
      if (typeForm==='login') {
        this.formActive.set(0);
      }
      else if (typeForm==='register'){
        this.formActive.set(1);
      }
      else{
        this.router.navigate(['/auth', 'user'],{
          queryParams:{
            q:'register'
          }
        })
      }
    })
  }
}
