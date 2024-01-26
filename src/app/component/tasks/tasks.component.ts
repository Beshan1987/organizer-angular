import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Task } from '../../services/tasks.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent {
  @Input() tasks!: Task[];
  @Input() toggleTask!: (number: string | undefined) => void;
  @Input() idChange!: string | undefined;
  @Input() onSubmitChange!: (task: Task) => void;
  @Input() cancel!: () => void;
  @Input() makeDone!: (task: Task) => void;
  @Input() removeTask!: (task: Task) => void;

  @Input() type!: 'daily' | 'shopping' | 'others';

  form: FormGroup = new FormGroup({
    task: new FormControl('', Validators.required),
  });
}
