import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatserviceService {

  constructor(private http: HttpClient, private Serv: ToastrService) { }

  httpOptions = {
    headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


  registerxyz(data): Observable<any> {
    return this.http.post('http://localhost:3000/users/register', data, this.httpOptions);
  }
 
  loginxyz(data): Observable<any> {
    return this.http.post('http://localhost:3000/users/login', data, this.httpOptions);
  }


  getOnlineFriends():Observable<any>
  {
    let token = localStorage.getItem('key');
    let httpOptions = {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization':'Bearer ' + token
      })
    };
    return this.http.get('http://localhost:3000/users/onlineusers',httpOptions);
  }


  getMessages(chatroom):Observable<any>
  {
    return this.http.post('http://localhost:3000/users/getmsg',chatroom,this.httpOptions);
  }


  forgotPass(data):Observable<any>{
    return this.http.post('http://localhost:3000/users/forgotpass',data,this.httpOptions);
  }

  
  resetPass(data,token):Observable<any>
  {
    let httpOptions = {
      headers : new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization':'Bearer ' + token
      })
    };
    return this.http.post('http://localhost:3000/users/resetpass',data,httpOptions);
  }


  sendFile(data:any):Observable<any>
  {
    let fd=new FormData();

    for(let i=0;i<data.length;i++)
    {
      console.log(i);
      fd.append('Files',data[i],data[i].name);
    }
    return this.http.post('http://localhost:3000/users/upload',fd);
  }


  errorToaster(msg1,msg2) {
    this.Serv.error(msg1,msg2);
  }
  error(msg1: any, msg2: any): any {
    throw new Error("Method not implemented.");
  }
 
  

}

