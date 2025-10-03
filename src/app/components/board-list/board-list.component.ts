import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { List, Card } from '../../models/board.models';
import { BoardCardComponent } from '../board-card/board-card.component';

@Component({
  selector: 'app-board-list',
  imports: [CdkDropList, BoardCardComponent],
  templateUrl: './board-list.component.html',
  styleUrl: './board-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardListComponent {
  readonly list = input.required<List>();
  readonly cardDropped = output<CdkDragDrop<Card[]>>();

  onDrop(event: CdkDragDrop<Card[]>): void {
    this.cardDropped.emit(event);
  }
}
