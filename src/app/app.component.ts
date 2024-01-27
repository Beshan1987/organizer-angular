import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { OrganizerComponent } from './component/organizer/organizer.component';
import { SelectorComponent } from './component/selector/selector.component';
import { CalendarComponent } from './component/calendar/calendar.component';
import { MomentPipe } from './services/pipe.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    OrganizerComponent,
    // SelectorComponent,
    // CalendarComponent,
    MomentPipe,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
