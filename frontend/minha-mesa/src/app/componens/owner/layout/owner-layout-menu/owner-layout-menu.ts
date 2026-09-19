import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-owner-layout-menu',
  imports: [],
  templateUrl: './owner-layout-menu.html',
  styleUrl: './owner-layout-menu.css',
})
export class OwnerLayoutMenu {
  currentPage = signal(0)

  buttonMenuClassList = "relative h-11 flex items-center gap-3 px-4 text-xm font-semibold text-gray-300 cursor-pointer hover:bg-emerald-500/20 rounded-r-xl hover:text-white group transition-all z-10"
  svgMenuClassList = "h-7 w-7  text-slate-400 group-hover:text-white cursor-pointer hover:bg-emerald-500/20 rounded-r-xl shrink-0 transition-colors"
}
