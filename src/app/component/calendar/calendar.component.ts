import { Component, Input, inject } from '@angular/core';
import moment, { Moment } from 'moment';
import { DateService } from '../../services/date.service';
import { CommonModule } from '@angular/common';
import { MomentPipe } from '../../services/pipe.pipe';
import { Task, TasksService } from '../../services/tasks.service';

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
  imports: [CommonModule, MomentPipe],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  calendar: Week[] = [];
  hasTask: Boolean = false;
  @Input() tasksDate!: string[];
  @Input() tasks!: Task[]

  dateService = inject(DateService);
  tasksService = inject(TasksService);
  constructor() {
    this.dateService.date.subscribe(this.generate.bind(this));
    // this.tasksService.getAll().subscribe((res) => (this.tasksDate = res));
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

  selectDay(day: Moment) {
    this.dateService.changeDay(day);
  }
}
