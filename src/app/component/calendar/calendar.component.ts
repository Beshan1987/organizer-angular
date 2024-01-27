import { Component, Input, inject } from '@angular/core';
import moment, { Moment } from 'moment';
import { DateService } from '../../services/date.service';
import { CommonModule } from '@angular/common';
import { MomentPipe } from '../../services/pipe.pipe';
import { Task, TasksService } from '../../services/tasks.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { SelectorComponent } from '../selector/selector.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

interface Day {
  value: Moment;
  active: boolean;
  disabled: boolean;
  selected: boolean;
}

interface Week {
  days: Day[];
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MomentPipe,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatCardModule,
    SelectorComponent,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  calendar: Week[] = [];
  hasTask: Boolean = false;
  isOpened: Boolean = true;
  selected: Date | null = null;
  @Input() tasksDate!: string[];
  @Input() tasks!: Task[];
  events: Date | null = null;

  addEvent(event: Date) {
    this.events = event;
    console.log(moment(this.events));
  }

  toggle() {
    console.log(this.isOpened);
    this.isOpened = !this.isOpened;
  }

  dateService = inject(DateService);
  tasksService = inject(TasksService);
  constructor() {
    this.dateService.date.subscribe(this.generate.bind(this));
    // this.tasksService.getAll().subscribe((res) => (this.tasksDate = res));
    console.log(this.tasksDate);
  }

  generate(now: Moment) {
    const startDay = now.clone().startOf('month').startOf('week');
    const endDay = now.clone().endOf('month').endOf('week');

    const date = startDay.clone().subtract(1, 'day');
    const calendar = [];

    while (date.isBefore(endDay, 'day')) {
      calendar.push({
        days: Array(7)
          .fill(0)
          .map(() => {
            const value = date.add(1, 'day').clone();
            const active = moment().isSame(value, 'date');
            const disabled = !now.isSame(value, 'month');
            const selected = now.isSame(value, 'date');

            return {
              value,
              active,
              disabled,
              selected,
            };
          }),
      });
    }
    this.calendar = calendar;
    console.log(calendar);
  }

  selectDay(day: Moment | Date) {
    if (day instanceof Date) {
      this.dateService.changeDay(moment(day));
    } else this.dateService.changeDay(day);
  }
}
