import { HttpClient } from '@angular/common/http';
import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { Moment } from 'moment';
import { Observable, map } from 'rxjs';

export interface Task {
  id?: string;
  task: string;
  date?: string;
  isDone: boolean;
  sum?: number;
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

  removeTask(task: Task): Observable<void> {
    return this.http.delete<void>(`${this.url}/${task.date}/${task.id}.json`);
  }

  getAll(): Observable<string[]> {
    return this.http.get<any>(`${this.url}.json`).pipe(
      map((date) => {
        return date ? Object.keys(date) : [];
      })
    );
  }

  makeDone(task: Task): Observable<any> {
    return this.http.patch<any>(
      `${this.url}/${task.date}/${task.id}.json`,
      task
    );
  }
  changeTask(task: Task): Observable<void> {
    return this.http.patch<void>(
      `${this.url}/${task.date}/${task.id}.json`,
      task
    );
  }

  getAllTasksCalendar(): Observable<any> {
    return this.http.get<any>(`${this.url}.json`);
  }
}
