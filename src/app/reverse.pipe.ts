import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {

  transform(value, reversing: boolean) {
    if ( reversing ) {
      return value.slice().reverse();
    }
    return value;
  }

}
