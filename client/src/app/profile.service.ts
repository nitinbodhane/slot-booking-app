import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  login(obj, callback) {
    const url = this.baseUrl + '/users/login';
    this.http.post(url, obj)
    .subscribe(response => {
      callback(null, response);
    }, error => {
      callback(error, null);
    });
  }

  register(obj, callback) {
    const url = this.baseUrl + '/users/register';
    this.http.post(url, obj)
    .subscribe(response => {
      callback(null, response);
    }, error => {
      callback(error, null);
    });
  }

  revokeToken(obj, callback) {
    const url = this.baseUrl + '/users/logout';
    this.http.post(url, obj)
    .subscribe(response => {
      callback(null, response);
    }, error => {
      callback(error, null);
    });
  }
}
