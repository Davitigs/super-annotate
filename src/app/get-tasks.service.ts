import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tasks } from './models/tasks.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetTasksService {

  constructor(
    private httpClient: HttpClient
  ) { }


  getData(): Observable<Tasks[]> {
    return this.httpClient.get<Tasks[]>('http://www.mocky.io/v2/5def635c2f000004178e09b1');
  }
}
