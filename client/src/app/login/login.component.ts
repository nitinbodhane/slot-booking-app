import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user = {};
  constructor(private profile: ProfileService, private router: Router) { }

  ngOnInit() {
  }

  doLogin() {
    console.log(this.user);
    this.profile.login(this.user, async (err, data) => {
      if (err) {
        console.log(err);
        this.router.navigate(['/login']);
      }
      if (data.token) {
        localStorage.setItem('token', data.token);
        this.router.navigate(['/home']);
      } else {
        alert(data.message);
      }
    });
  }
}
