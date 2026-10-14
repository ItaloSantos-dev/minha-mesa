import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UtilityService } from '../../../../service/utility-service/utility-service';

@Component({
  selector: 'app-client-layout-menu',
  imports: [RouterLink],
  templateUrl: './client-layout-menu.html',
  styleUrl: './client-layout-menu.css',
})
export class ClientLayoutMenu {
  currentPage = signal(0)
  private readonly utilitySercvice = inject(UtilityService);

  buttonMenuClassList = "relative h-11 flex items-center gap-3 px-4 text-xm font-semibold text-gray-300 cursor-pointer hover:bg-emerald-500/20 rounded-r-xl hover:text-white group transition-all z-10"
  svgMenuClassList = "h-7 w-7  text-slate-400 group-hover:text-white cursor-pointer hover:bg-emerald-500/20 rounded-r-xl shrink-0 transition-colors"

  ngOnInit(){
    this.utilitySercvice.updateCurrentPage$.subscribe((value) =>{this.currentPage.set(value)})
  }
}
