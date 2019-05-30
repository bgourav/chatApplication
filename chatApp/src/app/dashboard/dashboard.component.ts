import { Component, OnInit } from '@angular/core';
import { ChatserviceService } from '../chatservice.service';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from '../socket.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  showbar:boolean = false;
  loginName:String;
  senderId: string = localStorage.getItem('id');
  sendto:string;
  message: any = this.fb.group({
    "msg": ['', [Validators.required]],
  });
  userIdTo: any;
  userNameTo: any;
  userName: string;
  userId: string;
  chatRoom: string;
  showroom: boolean = false;
  users: any;
  messageArray: any;
  selectedFile: Array<File>;

  constructor(private fb: FormBuilder, private srv: ChatserviceService, private route: ActivatedRoute, private socket: SocketService) { }
   

  ngOnInit() {
    this.getOnlineFriends();
    this.socket.goOnline();
    this.loginName=localStorage.getItem('originalname');
    this.socket.changeUserStatus().subscribe(data => {
      this.changeUserStatus(data.id, data.status);
    })
  }


  getOnlineFriends() {
    this.srv.getOnlineFriends().subscribe((data) => {
      if (data.status == 200) {
        this.users = data.data;
        console.log(this.users);
      }
    })
  }



  showChatRoom(usersid, flname) {
    console.log(flname);
    
    this.sendto = flname;
    this.showroom = true;
    window.scroll()
    console.log(usersid);
    this.joinRoom(usersid, flname);
    this.getChatMessages();
    this.socket.newMessageReceived().subscribe(data => {
      this.messageArray = data.messages;
      setTimeout(() => {
        this.showbar = false;
      }, 1000);
      
      console.log("message receieved file",data.messages);

    });
  }


  joinRoom(id, flname) {
    this.userIdTo = id;
    this.userNameTo = flname;
    this.userName = localStorage.getItem('name');

    //Get the chat room by concatening User id of both users
    this.userId = localStorage.getItem('id');
    if (this.userId < this.userIdTo) {
      this.chatRoom = this.userId.concat(this.userIdTo);
    } else {
      this.chatRoom = this.userIdTo.concat(this.userId);
    }

    //Join chat room for 
    this.socket.joinRoom({ user: this.userName, room: this.chatRoom });
  }

  

  sendMessage(messageType: string) {
    this.updateScroll();
    if (this.message != '') {
      let data = {
        sendToName: this.userNameTo, sendToId: this.userIdTo, room: this.chatRoom, userNameFrom: this.userName,
        message: this.message.value.msg, messageType: messageType, messageStatus: { status: 'sent' }
      }
      console.log(data);
      this.socket.sendMessage(data);
      this.message.reset();
    }
  }


  getChatMessages() {
    this.srv.getMessages({ chatRoom: this.chatRoom })
      .subscribe(res => {
        if (res.status == 200) {
          this.messageArray = res.data;
          console.log(this.messageArray);
        }
      })
  }


  onchangefile(event)
  {
    this.selectedFile=event.target.files;
    this.showbar=true;
    this.srv.sendFile(this.selectedFile).subscribe((data)=>{
      if(data.status == 200)
      {
        if (this.message != '') {
          let filedata =[];
          for(let i=0;i<data.filename.length;i++)
          {
            filedata.push( {
              sendToName: this.userNameTo, sendToId: this.userIdTo,  userNameFrom: this.userName,
              message: data.filename[i], messageType: 'file', messageStatus: { status: 'sent' }
            });
          }
           
          console.log(filedata);
          this.socket.sendfile({ room: this.chatRoom, data:filedata}); 
        }
        
      } 
    })  
  }


   updateScroll(){
    var element = document.getElementById("fields");
    element.scrollTo(0, 400000000000)
}


  changeUserStatus(id, status: boolean) {
    console.log(id);
    if (this.users) {
      for (var i = 0; i < this.users.length; i++) {
        if (this.users[i]._id == id) {
          console.log("user updated: ");
          this.users[i].online = status;
        }
      }
    }
  }




}
