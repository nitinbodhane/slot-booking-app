import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { EventOperationService } from '../event-operation.service';
import { ProfileService } from '../profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private eventService: EventOperationService, private router: Router, private profile: ProfileService) {}

  title = 'my-whitehat-app';
  @ViewChild('calendar') calendarComponent: FullCalendarComponent; // the #calendar in the template

  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  renderEvent;
  calendarEvents: EventInput[] = [
    { title: 'Event Now', start: new Date() }
  ];
  // {
  //   start: '2019-05-14T10:00:00',
  //   end: '2019-05-16T16:00:00',
  //   rendering: 'background',
  //   backgroundColor: 'red',
  //   title: 'Nitin'
  // },
  // {
  //   start: '2019-05-18T10:00:00',
  //   end: '2019-05-19T16:00:00',
  //   rendering: 'background',
  //   backgroundColor: 'yellow',
  // }
  // var calendar = new Calendar(calendarEl, {
  //   defaultDate: '2014-11-10',
  //   defaultView: 'timeGridWeek',
  //   events: [
  //     {
  //       start: '2014-11-10T10:00:00',
  //       end: '2014-11-10T16:00:00',
  //       rendering: 'background'
  //     }
  //   ]
  // });

  ngOnInit() {
    console.log('ngOnInit');
    this.eventService.getEventList(async (err, response) => {
      if (err) {
        console.log(err);
      }
      response.data.map(x => {
        this.calendarEvents.push(x);
      });
    });
    // this.calendarEvents.push({start: '2019-05-18T10:00:00', title: 'jhbhnjkm'})
    console.log(this.calendarEvents);
  }

  toggleVisible() {
    this.calendarVisible = !this.calendarVisible;
  }

  toggleWeekends() {
    this.calendarWeekends = !this.calendarWeekends;
  }

  gotoPast() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate('2000-01-01'); // call a method on the Calendar object
  }

  handleDateClick(arg) {
    const eventName = prompt('Please enter class title.');
    if (eventName !== null) {
      if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
        const currObj = {
          start: arg.date,
          backgroundColor: 'green',
          title: eventName
        };
        this.eventService.addEvent(currObj, async (err, data) => {
          if (err) {
            console.log(err);
            this.router.navigate(['/dashboard']);
          }
          this.calendarEvents = this.calendarEvents.concat({ // add new event data. must create new array
            title: eventName,
            start: arg.date,
            allDay: arg.allDay
          });
        });
      }
    }
  }

  doLogout() {
    const token = localStorage.getItem('token');
    let obj = {
      "token": token
    };
    this.profile.revokeToken(obj, async (err, data) => {
      this.router.navigate(['/login']);
    })
  }
}
