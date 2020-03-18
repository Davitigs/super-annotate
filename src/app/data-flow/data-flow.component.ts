import { Component, OnInit } from '@angular/core';
import { TasksService } from '../tasks.service';
import { Observable } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { filter, map, tap } from 'rxjs/operators';
import { State } from '../models/state.model';

@Component({
  selector: 'app-data-flow',
  templateUrl: './data-flow.component.html',
  styleUrls: ['./data-flow.component.scss']
})
export class DataFlowComponent implements OnInit {

  tasks$: Observable<State>;
  group = 'status';
  sort = 'priority';
  reversed = false;
  constructor(
    private tasksService: TasksService
  ) { }

  ngOnInit() {
    this.tasksService.init().subscribe(console.log);
    this.tasks$ = this.tasksService.state$;
    this.tasks$.subscribe(console.log);
  }

  groupBy(opt: MatSelectChange) {
    this.group = opt.value;
    this.tasksService.init(opt.value, this.sort).subscribe();
  }

  sortBy( opt: MatSelectChange  ) {
    this.sort = opt.value;
    this.tasksService.init(this.group, opt.value).subscribe();
  }

  reverseSort() {
    this.reversed = !this.reversed
    this.tasksService.reverseSort();
  }

  replaceItem(direction: string, arrIndex: number, itemIndex: number, ) {
    this.tasksService.replaceItem(direction, arrIndex, itemIndex);
  }


}
