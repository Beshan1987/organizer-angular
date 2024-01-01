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

@Component({
  selector: 'app-organizer',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './organizer.component.html',
  styleUrl: './organizer.component.scss',
})
export class OrganizerComponent {
  dateService = inject(DateService);
  taskService = inject(TasksService);
  dateOfTask = '';
  tasks: Task[] = [];

  form: FormGroup = new FormGroup({
    task: new FormControl('', Validators.required),
  });

  constructor() {
    this.dateService.date.subscribe((date) => {
      this.dateOfTask = date.format('DD.MM.YYYY');
    });

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
      },
      (err) => err
    );
  }
  removeTask(task: Task) {}
}
