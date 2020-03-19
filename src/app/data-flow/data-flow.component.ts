import { Component, OnDestroy, OnInit } from '@angular/core';
import { TasksService } from '../tasks.service';
import { Observable, Subject } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { takeUntil } from 'rxjs/operators';
import { State } from '../models/state.model';

@Component({
  selector: 'app-data-flow',
  templateUrl: './data-flow.component.html',
  styleUrls: ['./data-flow.component.scss']
})
export class DataFlowComponent implements OnInit, OnDestroy {

  destroyNotifier = new Subject<void>();
  tasks$: Observable<State>;
  group = 'status';
  sort = 'priority';
  reversed = false;
  constructor(
    private tasksService: TasksService
  ) {
    // setInterval(() => this.tasksService.refreshData(), 15000);
  }

  ngOnInit() {
    this.tasksService.init().pipe(takeUntil(this.destroyNotifier)).subscribe();
    this.tasks$ = this.tasksService.state$;
  }

  groupBy(opt: MatSelectChange) {
    this.group = opt.value;
    this.tasksService.init(opt.value, this.sort, this.reversed).pipe(takeUntil(this.destroyNotifier)).subscribe();
  }

  sortBy( opt: MatSelectChange  ) {
    this.sort = opt.value;
    this.tasksService.init(this.group, opt.value, this.reversed).pipe(takeUntil(this.destroyNotifier)).subscribe();
  }

  reverseSort() {
    this.reversed = !this.reversed;
    this.tasksService.init(this.group, this.sort, this.reversed).pipe(takeUntil(this.destroyNotifier)).subscribe();
  }

  replaceItem(direction: string, arrIndex: number, itemIndex: number, ) {
    this.tasksService.replaceItem(direction, arrIndex, itemIndex);
  }


  ngOnDestroy() {
    this.destroyNotifier.next();
    this.destroyNotifier.complete();
  }



}
