import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tasks } from './models/tasks.model';
import { concatMap, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { GetTasksService } from './get-tasks.service';
import { State } from './models/state.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  groupedItems;
  groupeditems$: Observable<Array<Tasks[]>>;
  serverData: BehaviorSubject<Tasks[] | null> = new BehaviorSubject<Tasks[]>(null);
  state: BehaviorSubject<State | null> = new BehaviorSubject< State | null >(null);
  state$: Observable<State> = this.state.asObservable();

  constructor(
    private getTasks: GetTasksService
  ) {
    this.getTasks.getData().subscribe(resp => this.serverData.next(resp));
  }

  init( grouping = 'status', sorting = 'priority' ) {
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

        this.state.next({...this.stateValue, tasks: [
          tasks.sort((a, b) => sorting === 'name' ?
            a.assignee.name.localeCompare(b.assignee.name) :
            a[sorting].id - b[sorting].id
          )
          ]});

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

//   this.clearState();
//   return  this.serverData.pipe(
//     filter(data => !!data),
//   tap(data => data.sort((a, b) => a[sorting].id - b[sorting].id)),
//   tap(tasks => this.state.next({...this.stateValue, sorting: [...new Set(tasks
//     .map(task => task[sorting])
//     .sort((a, b) => a.id - b.id)
//     .map(filtered => filtered.title ? filtered.title : filtered.name))]}),
// ),
//   map(
//     tasks => [...new Set(tasks
// .map(task => task[grouping])
// .sort((a, b) => a.id - b.id)
// .map(filtered => filtered.title ? filtered.title : filtered.name ))],
// ),
//   tap (grouped => {
//   this.state.next({...this.stateValue, grouping: [...grouped]});
//   let itemsArray = [];
//
//   grouped.forEach(grp =>
//   this.serverData.value.filter(dr => itemsArray = [...itemsArray, dr[grouping]  === grp])
// );
//   console.log(this.tasksValue);
//   this.state.next({...this.stateValue, tasks: [...itemsArray]});
// }),
// switchMap(() => this.state$)
// );

}




