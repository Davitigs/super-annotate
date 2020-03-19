import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightFilter'
})
export class HighlightFilterPipe implements PipeTransform {

  transform(text: string, [search]): string {
    return search ? text.replace(new RegExp(search, 'i'), `<span class="highlight">${search}</span>`) : text;
  }

}
