import { Component } from '@angular/core';
import { Boxes } from "../../boxes/boxes";
import { OwnerRegister } from "../owner-register/owner-register";

@Component({
  selector: 'app-owner-auth',
  imports: [Boxes, OwnerRegister],
  templateUrl: './owner-auth.html',
  styleUrl: './owner-auth.css',
})
export class OwnerAuth {

}
