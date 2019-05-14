import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventOperationService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  async getEventList(callback) {
    const eventUrl = this.baseUrl + '/events';
    this.http.get(eventUrl)
    .subscribe(response => {
      callback(null, response);
    }, err => {
      console.log(err);
    });
  }

  addEvent(obj, callback) {
    const eventUrl = this.baseUrl + '/events';
    this.http.post(eventUrl, obj)
    .subscribe(response => {
      callback(null, response);
    }, error => {
      callback(error, null);
    });
  }

  updateEvent(obj, callback) {
    try {
      const eventUrl = this.baseUrl + '/events/' + obj.eventId;
      this.http.patch(eventUrl, obj)
      .subscribe(response => {
        callback(null, response);
      }, error => {
        callback(error, null);
      });
    } catch (error) {
      callback(error, null);
    }
  }

  deleteEvent(obj, callback) {
    const eventUrl = this.baseUrl + '/events/' + obj.eventId;
    this.http.delete(eventUrl)
    .subscribe(response => {
      callback(null, response);
    }, error => {
      callback(error, null);
    });
  }
}
