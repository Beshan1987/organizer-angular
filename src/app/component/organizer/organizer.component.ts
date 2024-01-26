import { Component, inject } from '@angular/core';
import { DateService } from '../../services/date.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Task, TasksService } from '../../services/tasks.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { switchMap, timeout } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../calendar/calendar.component';
import { Toast, ToastrService } from 'ngx-toastr';
import { Moment } from 'moment';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { TasksComponent } from '../tasks/tasks.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-organizer',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    CalendarComponent,
    MatTabsModule,
    MatIconModule,
    TasksComponent,
    MatButtonModule,
  ],
  templateUrl: './organizer.component.html',
  styleUrl: './organizer.component.scss',
})
export class OrganizerComponent {
  dateService = inject(DateService);
  taskService = inject(TasksService);
  dateOfTask = '';
  tasks: Task[] = [];
  dates: string[] = [];
  toastr: ToastrService = inject(ToastrService);
  idChange = '';
  totalSum = 0;
  form: FormGroup = new FormGroup({
    task: new FormControl('', Validators.required),
  });
  taskCakendar: Task[] = [];

  formShopping: FormGroup = new FormGroup({
    task: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
  });

  // countTotalSum() {
  //   return this.tasks.reduce((acc, item) => {
  //     if (item.sum) {
  //       acc += item.sum;
  //     }
  //     return acc;
  //   }, 0);
  // }

  constructor() {
    this.dateService.date.subscribe((date) => {
      this.dateOfTask = date.format('DD.MM.YYYY');
    });
    this.taskService.getAll().subscribe((res) => {
      this.dates = res;
      console.log(res);
    });

    this.taskService.getAllTasksCalendar().subscribe((res) => console.log(res));

    this.dateService.date
      .pipe(switchMap((value) => this.taskService.getAllTasks(value)))
      .subscribe((res) => {
        this.tasks = res;
        console.log(res);
        this.totalSum = res.reduce((acc, item) => {
          if (item.sum) {
            acc += item.sum;
          }

          return acc;
        }, 0);
      });
  }

  onSubmitChange(task: Task) {
    const taskValue = this.form.value.task;
    const taskForSending: Task = {
      ...task,
      task: taskValue,
    };
    console.log(taskForSending);
    this.taskService.changeTask(taskForSending).subscribe(() => {
      this.idChange = '';
      this.form.reset();
      this.tasks = this.tasks.map((t) => {
        if (t.id === task.id) {
          console.log({ ...taskForSending });
          return { ...t, task: taskForSending.task };
        } else return t;
      });
    });
  }

  cancel() {
    this.idChange = 'sass';
  }

  onSubmit() {
    const { task } = this.form.value;

    const taskForSending: Task = {
      task,
      date: this.dateService.date.value.format('DD-MM-YYYY'),
      isDone: false,
    };

    this.taskService.generateTask(taskForSending).subscribe(
      (task) => {
        this.tasks.push(task), this.form.reset();
        this.taskService.getAll().subscribe((res) => (this.dates = res));
        this.toastr.success('Task added');
        if (task.sum) {
          this.totalSum += task.sum;
        }
      },
      (err) => err
    );
  }

  onSubmitShop() {
    const { task, price } = this.formShopping.value;

    const taskForSending: Task = {
      task,
      date: this.dateService.date.value.format('DD-MM-YYYY'),
      isDone: false,
      sum: price,
    };

    this.taskService.generateTask(taskForSending).subscribe(
      (task) => {
        console.log('shop');
        this.tasks.push(task), this.formShopping.reset();
        this.taskService.getAll().subscribe((res) => (this.dates = res));
        this.toastr.success('Task added');
        if (task.sum) {
          this.totalSum += task.sum;
        }
      },
      (err) => err
    );
  }

  removeTask(task: Task) {
    this.taskService.removeTask(task).subscribe(() => {
      this.toastr.warning('Task deleted');
      this.tasks = this.tasks.filter((tas) => tas.id !== task.id);
      this.taskService.getAll().subscribe((res) => (this.dates = res));
      if (task.sum) {
        this.totalSum -= task.sum;
      }
    });
  }

  toggleTask(id: string | undefined) {
    if (id) {
      this.idChange = id;
    }
  }

  makeDone(task: Task) {
    this.taskService.makeDone({ ...task, isDone: true }).subscribe(() => {
      this.tasks = this.tasks.map((t) => {
        if (t.id === task.id) {
          return { ...t, isDone: true };
        } else return t;
      });
    });
  }
}
