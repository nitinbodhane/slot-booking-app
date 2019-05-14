import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  register = {};
  constructor(private profile: ProfileService, private router: Router) { }

  ngOnInit() {
  }

  doRegister() {
    console.log(this.register);
    this.profile.register(this.register, async (err, data) => {
      if (err) {
        console.log(err);
        this.router.navigate(['/register']);
      }
      if (data.id) {
        this.router.navigate(['/login']);
      } else {
        alert(data.message);
      }
    });
  }
}
