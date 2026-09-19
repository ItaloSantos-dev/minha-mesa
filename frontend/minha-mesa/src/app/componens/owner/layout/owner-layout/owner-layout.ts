import { Component, signal } from '@angular/core';
import { OwnerLayoutMenu } from '../owner-layout-menu/owner-layout-menu';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-owner-layout',
  imports: [OwnerLayoutMenu, RouterOutlet],
  templateUrl: './owner-layout.html',
  styleUrl: './owner-layout.css',
})
export class OwnerLayout {
  
}
