import { Component, inject, signal } from '@angular/core';
import { UtilityService } from '../../../../service/utility-service/utility-service';

@Component({
  selector: 'app-owner-layout-menu',
  imports: [],
  templateUrl: './owner-layout-menu.html',
  styleUrl: './owner-layout-menu.css',
})
export class OwnerLayoutMenu {
  utilityService = inject(UtilityService);

  currentPage = signal(0)

  buttonMenuClassList = "relative h-11 flex items-center gap-3 px-4 text-xm font-semibold text-gray-300 cursor-pointer hover:bg-emerald-500/20 rounded-r-xl hover:text-white group transition-all z-10"
  svgMenuClassList = "h-7 w-7  text-slate-400 group-hover:text-white cursor-pointer hover:bg-emerald-500/20 rounded-r-xl shrink-0 transition-colors"

  ngOnInit(){
    this.utilityService.updateCurrentPage$.subscribe( (value) =>{
      this.currentPage.set(value);
    })
  }
}
