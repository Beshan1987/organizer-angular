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
  isOpened: Boolean = false;
  tasks: Task[] = [];
  dates: string[] = [];
  toastr: ToastrService = inject(ToastrService);
  idChange = '';
  totalSum: number = 0;
  form: FormGroup = new FormGroup({
    task: new FormControl('', Validators.required),
  });
  taskCakendar: Task[] = [];

  formShopping: FormGroup = new FormGroup({
    task: new FormControl(null, Validators.required),
    price: new FormControl('', Validators.required),
    amount: new FormControl(1, Validators.required),
  });

  clearInput() {
    this.formShopping.controls['amount'].reset('');
  }

  toggleAmountInput() {
    this.isOpened = !this.isOpened;
  }

  constructor() {
    this.dateService.date.subscribe((date) => {
      this.dateOfTask = date.format('DD.MM.YYYY');
    });
    this.taskService.getAll().subscribe((res) => {
      this.dates = res;
    });

    this.taskService.getAllTasksCalendar().subscribe((res) => console.log(res));

    this.dateService.date
      .pipe(switchMap((value) => this.taskService.getAllTasks(value)))
      .subscribe((res) => {
        this.tasks = res;
        this.totalSum = res.reduce((acc, item) => {
          if (item.totalSum) {
            acc += item.totalSum;
          }

          return acc;
        }, 0);
      });
  }

  onSubmitChange(task: Task) {
    if (!task.sum) {
      const taskValue = this.form.value.task;
      const taskForSending: Task = {
        ...task,
        task: taskValue,
      };
      this.taskService.changeTask(taskForSending).subscribe(() => {
        this.idChange = '';
        this.form.reset();
        this.tasks = this.tasks.map((t) => {
          if (t.id === task.id) {
            return { ...t, task: taskForSending.task };
          } else return t;
        });
      });
    }
    if (task.sum && task.amount && task.totalSum) {
      const { task: newTask, price, amount } = this.formShopping.value;
      const taskForSending: Task = {
        ...task,
        task: newTask,
        sum: price,
        amount: amount,
        totalSum: amount * price,
      };
      this.taskService.changeTask(taskForSending).subscribe(() => {
        this.idChange = '';
        this.formShopping.reset();
        this.formShopping.controls['amount'].reset(1);
        this.tasks = this.tasks.map((t) => {
          if (t.id === task.id) {
            return {
              ...t,
              task: taskForSending.task,
              sum: taskForSending.sum,
              amount: taskForSending.amount,
              totalSum: taskForSending.totalSum,
            };
          } else return t;
        });
      });
      if (task.totalSum && taskForSending.totalSum) {
        this.totalSum = this.totalSum - task.totalSum + taskForSending.totalSum;
      }
    }
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
        if (task.totalSum) {
          this.totalSum += task.totalSum;
        }
      },
      (err) => err
    );
  }

  onSubmitShop() {
    const { task, price, amount } = this.formShopping.value;
    const totalSum = price * amount;

    const taskForSending: Task = {
      task,
      date: this.dateService.date.value.format('DD-MM-YYYY'),
      isDone: false,
      sum: price,
      amount: amount,
      totalSum: totalSum,
    };

    this.taskService.generateTask(taskForSending).subscribe(
      (task) => {
        this.tasks.push(task), this.formShopping.reset();
        this.formShopping.controls['amount'].reset(1);
        this.taskService.getAll().subscribe((res) => (this.dates = res));
        this.toastr.success('Task added');
        this.isOpened = false;
        if (task.totalSum) {
          this.totalSum += task.totalSum;
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
      if (task.totalSum) {
        this.totalSum -= +task.totalSum;
        this.totalSum = +this.totalSum.toFixed(2);
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
