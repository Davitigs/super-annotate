import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tasks } from './models/tasks.model';
import { filter, mergeMap, take, tap } from 'rxjs/operators';
import { GetTasksService } from './get-tasks.service';
import { State } from './models/state.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  grouping: string;
  sorting: string;
  serverData: BehaviorSubject<Tasks[] | null> = new BehaviorSubject<Tasks[]>(null);
  state: BehaviorSubject<State | null> = new BehaviorSubject< State | null >(null);
  state$: Observable<State> = this.state.asObservable();

  constructor(
    private getTasks: GetTasksService
  ) {
    this.getTasks.getData()
      .pipe(
        take(1),
        tap(tasks => {
          this.serverData.next(tasks);
        })
      ).subscribe();
  }

  init( grouping = 'status', sorting = 'priority') {
      this.grouping = grouping;
      this.sorting = sorting;
      this.resetState();
      return this.serverData.pipe(
        filter(data => !!data),
        tap(tasks => {
            this.state.next({
              ...this.stateValue, grouping:
                [...new Set(tasks.map(task => task[grouping]).sort((a, b) => a.id - b.id)
                  .map(st => st.title ? st.title : st.name))]
            });

            this.state.next({
              ...this.stateValue, sorting: sorting === 'name' ?
                [...new Set(tasks.map(task => task.assignee).sort((a, b) => a.name.localeCompare(b.name))
                  .map(st => st.name))] :
                [...new Set(tasks.map(task => task[sorting]).sort((a, b) => a.id - b.id)
                  .map(st => !!st.title ? st.title : st.name))]
            });

            let groupedArray = [];

            this.stateValue.grouping.forEach(grp =>
              groupedArray = [...groupedArray, tasks.filter(task => task[grouping].title ?
                task[grouping].title === grp : task[grouping].name === grp)]);
            this.state.next({...this.stateValue, tasks: [...groupedArray]});

          }
        ));

  }

  resetState() {
    this.state.next({...this.stateValue, grouping: [], sorting: [], tasks: []});
  }

  get stateValue() {
    return this.state.value;
  }


  replaceItem(direction, arrIndex, itemIndex) {

    let tasksCopy = [];
    let fakeTask;
    this.stateValue.tasks.forEach(task => tasksCopy = [...tasksCopy, task]);

    if ( tasksCopy[arrIndex].length === 1 ) {
      fakeTask = {...tasksCopy[arrIndex][itemIndex]};
      fakeTask.title = 'fake';
    }
    tasksCopy[arrIndex][itemIndex].status = (direction === 'next') ?
      tasksCopy[arrIndex + 1][0].status : tasksCopy[arrIndex - 1][0].status;
    (direction === 'next') ?
      tasksCopy[arrIndex + 1].push(...tasksCopy[arrIndex].splice(itemIndex, 1)) :
      tasksCopy[arrIndex - 1].push(...tasksCopy[arrIndex].splice(itemIndex, 1));

    // the very very very bad way to solve the empty array problem

    if (fakeTask) {
      tasksCopy[arrIndex].push(fakeTask);
    }
    let tasks = [];
    tasksCopy.forEach(task => task.forEach(tsk => tasks = [...tasks, tsk]));
    this.serverData.next(tasks);
    return this.init(this.grouping, this.sorting);

  }

  refreshData() {
    return this.getTasks.getData()
      .pipe(
        tap(taskgrp => {
          let origTasks = [];
          this.stateValue.tasks.forEach(task => origTasks = [...origTasks, ...task]);
          origTasks.forEach(task => taskgrp.forEach(tsk => {
            if ( tsk.id === task.id ) {
              task.title = tsk.title;
            }
          }));
          this.serverData.next(origTasks);
        }),
        mergeMap(() => this.init(this.grouping, this.sorting))
      );
  }


}




