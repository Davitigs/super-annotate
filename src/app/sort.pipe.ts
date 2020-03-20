import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(value, sorting: string, reversing: boolean) {
    if ( reversing ) {
      return value.sort((a, b) => sorting === 'name' ?
        a.assignee.name.localeCompare(b.assignee.name) :
        a[sorting].id - b[sorting].id
      );
    } else {
      return value.sort((a, b) => sorting === 'name' ?
        b.assignee.name.localeCompare(a.assignee.name) :
        b[sorting].id - a[sorting].id
      );
    }
    return value;
  }



}
