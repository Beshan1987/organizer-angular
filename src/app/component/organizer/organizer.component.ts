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
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../calendar/calendar.component';

@Component({
  selector: 'app-organizer',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    CalendarComponent,
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

  form: FormGroup = new FormGroup({
    task: new FormControl('', Validators.required),
  });

  constructor() {
    this.dateService.date.subscribe((date) => {
      this.dateOfTask = date.format('DD.MM.YYYY');
    });
    this.taskService.getAll().subscribe((res) => (this.dates = res));

    this.dateService.date
      .pipe(switchMap((value) => this.taskService.getAllTasks(value)))
      .subscribe((res) => (this.tasks = res));
  }

  onSubmit() {
    const { task } = this.form.value;

    const taskForSending: Task = {
      task,
      date: this.dateService.date.value.format('DD-MM-YYYY'),
    };

    this.taskService.generateTask(taskForSending).subscribe(
      (task) => {
        this.tasks.push(task), this.form.reset();
        this.taskService.getAll().subscribe((res) => (this.dates = res));
      },
      (err) => err
    );
  }
  removeTask(task: Task) {
    this.taskService.removeTask(task).subscribe(() => {
      this.tasks = this.tasks.filter((tas) => tas.id !== task.id);
      this.taskService.getAll().subscribe((res) => (this.dates = res));
    });
  }
}
