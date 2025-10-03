import { Component, ChangeDetectionStrategy, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { BoardListComponent } from '../board-list/board-list.component';
import { AddCardAccordionComponent } from '../add-card-accordion/add-card-accordion.component';
import { BoardService } from '../../services/board.service';
import { Card } from '../../models/board.models';

@Component({
  selector: 'app-board-container',
  imports: [CommonModule, FormsModule, CdkDropListGroup, ButtonModule, DatePickerModule, BoardListComponent, AddCardAccordionComponent],
  templateUrl: './board-container.component.html',
  styleUrl: './board-container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardContainerComponent implements OnInit {
  private readonly boardService = inject(BoardService);
  readonly board$ = this.boardService.board$;
  selectedDate: Date = new Date();
  savedDates: string[] = [];
  sidebarOpen = false;
  currentView: 'board' | 'table' | 'timeline' = 'board';
  readonly minDate: Date = new Date(2000, 0, 1);
  readonly maxDate: Date = new Date(2100, 11, 31);

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onCardDrop(event: CdkDragDrop<Card[]>): void {
    this.boardService.moveCard(event);
  }

  exportJson(): void {
    // Use local date to avoid timezone issues
    const year = this.selectedDate.getFullYear();
    const month = String(this.selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(this.selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const jsonString = this.boardService.exportBoardWithDate(dateStr);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `boardify-pro-${dateStr}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  importJson(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonString = e.target?.result as string;
        this.boardService.importBoardFromJson(jsonString);
        alert('Board imported successfully!');
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to import board');
      }
    };

    reader.readAsText(file);
    input.value = '';
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click();
  }

  onCardAdded(data: { title: string; description: string; type: 'task' | 'report'; listId: string }): void {
    this.boardService.addCard(data.listId, data.title, data.description, data.type);
    this.updateSavedDates();
    this.sidebarOpen = false; // Close sidebar after adding card
  }

  onDateChange(date: Date): void {
    if (!date) {
      return;
    }

    // Use local date to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    this.boardService.loadBoardForDate(dateStr);
    this.updateSavedDates();
  }

  async updateSavedDates(): Promise<void> {
    this.savedDates = await this.boardService.getAllSavedDates();
  }

  async ngOnInit(): Promise<void> {
    // Load today's board on init
    const year = this.selectedDate.getFullYear();
    const month = String(this.selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(this.selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    this.boardService.loadBoardForDate(dateStr);
    
    await this.updateSavedDates();
  }
}