import { Pipe, PipeTransform } from '@angular/core';
import { Moment } from 'moment';

@Pipe({
  name: 'moment',
  standalone: true,
})
export class MomentPipe implements PipeTransform {
  transform(value: Moment, format: string = 'MMM YYY'): string {
    return value.format(format);
  }
}
