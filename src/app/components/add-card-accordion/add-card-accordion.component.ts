import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CardType, List } from '../../models/board.models';

interface NewCardData {
  title: string;
  description: string;
  type: CardType;
  listId: string;
}

@Component({
  selector: 'app-add-card-accordion',
  imports: [
    AccordionModule,
    InputTextModule,
    InputTextarea,
    ButtonModule,
    DropdownModule,
    FormsModule
  ],
  templateUrl: './add-card-accordion.component.html',
  styleUrl: './add-card-accordion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddCardAccordionComponent {
  readonly lists = input.required<List[]>();
  readonly cardAdded = output<NewCardData>();

  taskTitle = '';
  taskDescription = '';
  selectedTaskList: List | null = null;

  reportTitle = '';
  reportDescription = '';
  selectedReportList: List | null = null;

  addTask(): void {
    if (this.taskTitle.trim() && this.selectedTaskList?.id) {
      this.cardAdded.emit({
        title: this.taskTitle,
        description: this.taskDescription,
        type: 'task',
        listId: this.selectedTaskList.id
      });
      this.resetTaskForm();
    }
  }

  addReport(): void {
    if (this.reportTitle.trim() && this.selectedReportList?.id) {
      this.cardAdded.emit({
        title: this.reportTitle,
        description: this.reportDescription,
        type: 'report',
        listId: this.selectedReportList.id
      });
      this.resetReportForm();
    }
  }

  private resetTaskForm(): void {
    this.taskTitle = '';
    this.taskDescription = '';
    this.selectedTaskList = null;
  }

  private resetReportForm(): void {
    this.reportTitle = '';
    this.reportDescription = '';
    this.selectedReportList = null;
  }
}
