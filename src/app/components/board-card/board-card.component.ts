import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { Card } from '../../models/board.models';

@Component({
  selector: 'app-board-card',
  imports: [CdkDrag, CardModule, DialogModule],
  templateUrl: './board-card.component.html',
  styleUrl: './board-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardCardComponent {
  readonly card = input.required<Card>();
  dialogVisible = false;

  openDialog(): void {
    this.dialogVisible = true;
  }
}
