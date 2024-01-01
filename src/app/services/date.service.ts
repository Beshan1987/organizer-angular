import { Injectable } from '@angular/core';
import moment, { Moment } from 'moment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  public date: BehaviorSubject<Moment> = new BehaviorSubject(moment());
  constructor() {}

  changeMonth(dir: number) {
    const value = this.date.value.add(dir, 'month');
    this.date.next(value);
  }
  changeDay(date: Moment) {
    const value = this.date.value.set({
      date: date.date(),
      month: date.month(),
    });
    this.date.next(value);
  }
}
