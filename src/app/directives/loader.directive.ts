import { Directive } from '@angular/core';

@Directive({
  selector: '[appLoader]'
})
export class LoaderDirective {

  constructor() {
    console.log(' ::>> loader initialised');
  }
}
