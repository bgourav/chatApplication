import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private rout:Router,private socket :SocketService) { }

  ngOnInit() {
  }

  logout()
{
  this.socket.goOffline();
  localStorage.clear();
  this.rout.navigate(['login']);
}


}




