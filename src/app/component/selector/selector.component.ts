import { Component, Input, inject } from '@angular/core';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'app-selector',
  standalone: true,
  imports: [],
  templateUrl: './selector.component.html',
  styleUrl: './selector.component.scss',
})
export class SelectorComponent {
  @Input() toggle!: () => void;
  dateService = inject(DateService);
  currentMonth: string = '';
  isOpened: Boolean = false;

  constructor() {
    this.dateService.date.subscribe((res) => {
      this.currentMonth = res.format('MMM YYYY');
    });
  }

  changeMonth(dir: number) {
    return this.dateService.changeMonth(dir);
  }
}
