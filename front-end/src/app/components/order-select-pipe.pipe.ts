import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderSelectPipe'
})
export class OrderSelectPipePipe implements PipeTransform {

  transform(array: any): any {
    array = array.sort((a: any, b: any) => a.name.localeCompare(b.name))
    return array;
  }

}
