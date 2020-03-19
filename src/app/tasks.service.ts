import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Tasks } from './models/tasks.model';
import { concatMap, filter, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { GetTasksService } from './get-tasks.service';
import { State } from './models/state.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  firstTimeDataObtain = 0;
  grouping: string;
  sorting: string;
  serverData: BehaviorSubject<Tasks[] | null> = new BehaviorSubject<Tasks[]>(null);
  state: BehaviorSubject<State | null> = new BehaviorSubject< State | null >(null);
  state$: Observable<State> = this.state.asObservable();
  serverData$: Observable<Tasks[]>;

  constructor(
    private getTasks: GetTasksService
  ) {
    this.serverData$ = this.getTasks.getData();
    this.getTasks.getData().pipe(take(1)).subscribe(resp => this.serverData.next(resp));
  }

  init( grouping = 'status', sorting = 'priority' ) {
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
                [...new Set(tasks.map(task => task[sorting]).sort((a, b) => a.name ? a.name - b.name : a.id - b.id)
                  .map(st => !!st.title ? st.title : st.name))]
            });

            this.state.next({
              ...this.stateValue, tasks: [
                tasks.sort((a, b) => sorting === 'name' ?
                  a.assignee.name.localeCompare(b.assignee.name) :
                  a[sorting].id - b[sorting].id
                )
              ]
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

  reverseSort() {
    let reversedSorting = [];
    this.stateValue.tasks.forEach(task => reversedSorting = [...reversedSorting, task.reverse()]);
    this.state.next({...this.stateValue, tasks: reversedSorting});
  }

  get stateValue() {
    return this.state.value;
  }

  get tasksValue() {
    return this.state.value.tasks;
  }

  replaceItem(direction, arrIndex, itemIndex) {
    let tasksCopy = [];
    this.stateValue.tasks.forEach(task => tasksCopy = [...tasksCopy, task]);
    tasksCopy[arrIndex][itemIndex].status = (direction === 'next') ?
      tasksCopy[arrIndex + 1][itemIndex].status : tasksCopy[arrIndex - 1][itemIndex].status;
    (direction === 'next') ?
      tasksCopy[arrIndex + 1].push(...tasksCopy[arrIndex].splice(itemIndex, 1)) :
      tasksCopy[arrIndex - 1].push(...tasksCopy[arrIndex].splice(itemIndex, 1));

    console.log(tasksCopy);
    this.state.next({...this.stateValue, tasks: [...tasksCopy]});

  }

  refreshData() {
    this.getTasks.getData()
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
        })
      )
      .subscribe();
  }


}




