import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ChatserviceService } from '../chatservice.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgotpsw',
  templateUrl: './forgotpsw.component.html',
  styleUrls: ['./forgotpsw.component.css']
})
export class ForgotpswComponent implements OnInit {

  token:any;

  forgotpass = this.fb.group({
    password: ['', [Validators.required]],
    confirmpassword: ['', [Validators.required]]
  })
  constructor(private fb: FormBuilder,private srv: ChatserviceService,private rout: ActivatedRoute) { }

  ngOnInit() {
    this.rout.queryParams.subscribe(params => {
      console.log("params",params)
      this.token = params['token']; 
      console.log("Tookkeen", this.token);

    });
  }


  forgotData() {
    if (this.forgotpass.value.password != this.forgotpass.value.confirmpassword) {
      this.srv.errorToaster("Password Confirmation Failed", "");
    }
    else {
      console.log(this.forgotpass.value.password,this.token);
      this.srv.resetPass({"password":this.forgotpass.value.password},this.token).subscribe((data)=>{
        console.log(data);
      });
    }
  }




}

