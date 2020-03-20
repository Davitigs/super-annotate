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
    // setInterval(() => this.tasksService.refreshData().pipe(takeUntil(this.destroyNotifier)).subscribe(), 15000);
  }

  ngOnInit() {
    this.tasksService.init().pipe(takeUntil(this.destroyNotifier)).subscribe();
    this.tasks$ = this.tasksService.state$;
  }

  groupBy(opt: MatSelectChange) {
    this.group = opt.value;
    this.tasksService.init(opt.value, this.sort).pipe(takeUntil(this.destroyNotifier)).subscribe();
  }

  sortBy( opt: MatSelectChange  ) {
    this.sort = opt.value;
    this.tasksService.init(this.group, opt.value).pipe(takeUntil(this.destroyNotifier)).subscribe();
  }

  reverseSort() {
    this.reversed = !this.reversed;
  }

  replaceItem(direction: string, arrIndex: number, itemIndex: number, ) {
    this.tasksService.replaceItem(direction, arrIndex, itemIndex).pipe(takeUntil(this.destroyNotifier)).subscribe();
  }


  ngOnDestroy() {
    this.destroyNotifier.next();
    this.destroyNotifier.complete();
  }



}
