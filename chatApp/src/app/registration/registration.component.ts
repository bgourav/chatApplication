import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ChatserviceService } from '../chatservice.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationForm=this.fb.group({
    fullname: ['', Validators.required],
    email: ['', Validators.required],
    psw: ['', Validators.required],
    rpsw: ['', Validators.required]
 
  });

  constructor(private fb:FormBuilder,private srv: ChatserviceService) { }

  ngOnInit() {
  }

  register()
  {
    console.log(this.registrationForm.value);
    this.srv.registerxyz(this.registrationForm.value).subscribe((data)=>{
      if(data.status == 200)
      {
        alert("Successfully registered");

      }
      else
      {
        alert("Not valid!, try again.");
      }
    })
    
  }



}
