import { Component } from '@angular/core';
import { ClientLayoutMenu } from '../client-layout-menu/client-layout-menu';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-client-layout',
  imports: [ClientLayoutMenu, RouterOutlet],
  templateUrl: './client-layout.html',
  styleUrl: './client-layout.css',
})
export class ClientLayout {

}
