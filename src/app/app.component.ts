import { Component } from '@angular/core';
import { BoardContainerComponent } from './components/board-container/board-container.component';

@Component({
  selector: 'app-root',
  imports: [BoardContainerComponent],
  template: '<app-board-container />'
})
export class AppComponent {}
