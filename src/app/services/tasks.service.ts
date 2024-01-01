import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Moment } from 'moment';
import { Observable, map } from 'rxjs';

export interface Task {
  id?: string;
  task: string;
  date?: string;
}

export interface CreateResponse {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private url = 'https://calendar-cc3ba-default-rtdb.firebaseio.com/tasks';
  constructor(private http: HttpClient) {}

  generateTask(task: Task): Observable<Task> {
    return this.http
      .post<CreateResponse>(`${this.url}/${task.date}.json`, task)
      .pipe(
        map((res) => {
          console.log(res);
          return { ...task, id: res.name };
        })
      );
  }

  getAllTasks(date: Moment): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${this.url}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(
        map((tasks: Task[]) => {
          if (!tasks) {
            return [];
          }
          console.log(
            Object.keys(tasks).map((key) => ({
              ...tasks[key as any],
              id: key,
            }))
          );
          return Object.keys(tasks).map((key) => ({
            ...tasks[key as any],
            id: key,
          }));
        })
      );
  }
}