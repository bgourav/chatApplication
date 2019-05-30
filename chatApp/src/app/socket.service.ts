import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = 'http://localhost:3000';
  private socket; 


  constructor() {

    this.socket = io(this.url);
   }


  joinRoom(data) {
    this.socket.emit('join', data);
  }

  goOnline() {
    this.socket.emit('goOnline', localStorage.getItem('id'));
  }

  goOffline() {
    this.socket.emit('goOffline', localStorage.getItem('id'));
  }

  sendMessage(data) {
    this.socket.emit('message', data);
  }
  sendfile(data) {
    this.socket.emit('file', data);
  }

  changeUserStatus() {
    const observable = new Observable<any>(observer => {
      this.socket.on('changeUserStatus', (data) => {
        console.log("user offline: " + data.id + data.status);
        observer.next(data);
      })
    })
    return observable;
  }

  newMessageReceived() {
    const observable = new Observable<any>(observer => {
      this.socket.on('messageReceived', (data) => {
        console.log("new message received");
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }



}


