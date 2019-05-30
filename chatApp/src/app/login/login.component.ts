import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ChatserviceService } from '../chatservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  forgot:boolean=false;
  signIn:boolean= true;

  forgotpass:any=this.fb.group({
    "email" : ['',[Validators.required,Validators.email]],
  });


  loginForm = this.fb.group({
    emailid: ['', Validators.required],
    psw: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private srv: ChatserviceService, private rout: Router) { }

  ngOnInit() {
  }


  login() {
    console.log(this.loginForm.value);
    this.srv.loginxyz(this.loginForm.value).subscribe((data) => {
      if (data.status == 200) {
        alert("login Successfully");
        window.localStorage.setItem('key', data.token);
        console.log(data);
        window.localStorage.setItem('id',data.data._id);
        window.localStorage.setItem('originalname',data.data.fullname)
        this.rout.navigate(['/chatZone']);

      }
      else {
        alert("user Not Found");
      }
    })

  }


  forgetpass()
  {
    this.signIn=false;
    this.forgot=true;
  }


  forgotData()
  {
    this.srv.forgotPass(this.forgotpass.value).subscribe((data)=>{
      
    })
  }



}
