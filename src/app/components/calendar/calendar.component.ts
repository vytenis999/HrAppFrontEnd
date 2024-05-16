import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';

import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';

import ltLocale from "@fullcalendar/core/locales/lt";
import { Calendar, CalendarDate } from "../../models/calendar.model";
import { CalendarService } from "../../services/calendar.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  Events = [];
  options!: CalendarOptions;

  events!: any[];

  candidates: Calendar[] = [];

  eventsMy: CalendarDate[] = [];

  test!: any;
  test2!: any;


  months = ["sausis", "vasaris", "kovas", "balandis", "gegužė", "birželis", "liepa", "rugpjūtis", "rugsėjis", "spalis", "lapkritis", "gruodis"]

  constructor(private service: CalendarService,) { }





  ngOnInit(): void {
    this.test = new Date().getFullYear() + "_" + (new Date().getMonth() + 1);
    this.service.getCandidates(this.test).subscribe({
      next: (data) => {
        this.candidates = data;
        for (let i = 0; i < this.candidates.length; i++) {
          var titlet = this.candidates[i].name + ' ' + this.candidates[i].surname;

          var datet = this.candidates[i].willBeContacted;

          this.eventsMy.push({ title: titlet, date: datet });
          console.log(this.eventsMy);
          this.calendarOptions = {
            initialView: 'dayGridMonth',
            events: this.eventsMy,
            height: 600,
            locale: ltLocale,

            headerToolbar: {
              end: '',
              center: '',
              start: '',
            },

          };
        }

      },
      error: (error) => {
        console.log(error.status);
      }
    })
    this.test2 = new Date().getFullYear() + " m. " + this.months[(new Date().getMonth())];
  }

  nextCalendarPage() {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
    this.test = calendarApi.getDate().getFullYear() + "_" + (calendarApi.getDate().getMonth() + 1);
    calendarApi.removeAllEvents();
    calendarApi.setOption("locale", "lt")
    this.test2 = calendarApi.getDate().getFullYear() + " m. " + this.months[calendarApi.getDate().getMonth()];

    this.calendarPageRefesh()
  }

  prevCalendarPage() {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.prev();
    this.test = calendarApi.getDate().getFullYear() + "_" + (calendarApi.getDate().getMonth() + 1);
    calendarApi.removeAllEvents();
    this.test2 = calendarApi.getDate().getFullYear() + " m. " + this.months[calendarApi.getDate().getMonth()];

    calendarApi.handleAction

    this.calendarPageRefesh()
  }

  calendarPageRefesh() {
    let calendarApi = this.calendarComponent.getApi();
    this.service.getCandidates(this.test).subscribe({
      next: (data) => {
        console.log(data);
        this.candidates = data;
        for (let i = 0; i < this.candidates.length; i++) {
          var titlet = this.candidates[i].name + ' ' + this.candidates[i].surname;
          //console.log(titlet);
          var datet = this.candidates[i].willBeContacted;
          //console.log(datet);
          calendarApi.addEvent({ title: titlet, date: datet });
        }
      },
      error: (error) => {
        console.log(error.status);
      }
    })

  }

  todayCalendarPage() {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.today();
    this.test = calendarApi.getDate().getFullYear() + "_" + (calendarApi.getDate().getMonth() + 1);
    calendarApi.removeAllEvents();
    this.test2 = calendarApi.getDate().getFullYear() + " m. " + this.months[calendarApi.getDate().getMonth()];

    this.calendarPageRefesh()
  }


  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    height: 600,
    locale: ltLocale,

    headerToolbar: {
      end: '',
      center: '',
      start: '',
    },
  };


}
