import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Observable, BehaviorSubject, of, from } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { Board, Card, CardType, CardStatus } from '../models/board.models';
import { IndexedDbService } from './indexed-db.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private readonly http = inject(HttpClient);
  private readonly indexedDb = inject(IndexedDbService);
  private readonly boardState = signal<Board | null>(null);
  private readonly boardSubject = new BehaviorSubject<Board | null>(null);
  private readonly currentDateSubject = new BehaviorSubject<string>(this.getTodayDateISO());

  constructor() {
    this.indexedDb.initDB();
  }

  readonly board$ = this.boardSubject.asObservable();

  readonly board = this.boardState.asReadonly();

  private getTodayDateISO(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private loadBoardByDate(date: string): Observable<Board> {
    // Try IndexedDB first
    return from(this.indexedDb.getBoard(date)).pipe(
      switchMap(indexedBoard => {
        if (indexedBoard) {
          this.updateBoardState(indexedBoard);
          return of(indexedBoard);
        }

        // Try date-specific JSON file
        const url = `assets/apis/json/${date}.json`;
        return this.http.get<Board>(url).pipe(
          tap(board => {
            const boardWithISODate = { ...board, date };
            this.updateBoardState(boardWithISODate);
            this.indexedDb.saveBoard(boardWithISODate); // Save to IndexedDB
          }),
          catchError(() => {
            // If date-specific file not found, load default
            return this.http.get<Board>('assets/apis/json/board-data.json').pipe(
              tap(board => {
                const boardWithDate = { ...board, date };
                this.updateBoardState(boardWithDate);
                this.indexedDb.saveBoard(boardWithDate); // Save to IndexedDB
              })
            );
          })
        );
      })
    );
  }

  private updateBoardState(board: Board): void {
    this.boardState.set(board);
    this.boardSubject.next(board);
  }

  loadBoardForDate(date: string): void {
    this.currentDateSubject.next(date);
    this.loadBoardByDate(date).subscribe({
      next: (board) => {
        console.log('Board loaded for date:', date, board);
      },
      error: (err) => {
        console.error('Error loading board for date:', date, err);
      }
    });
  }

  private async saveBoardToIndexedDB(board: Board): Promise<void> {
    if (board.date) {
      await this.indexedDb.saveBoard(board);
    }
  }

  saveCurrentBoard(): void {
    const board = this.boardState();
    if (board) {
      this.saveBoardToIndexedDB(board);
    }
  }

  async deleteBoard(date: string): Promise<void> {
    await this.indexedDb.deleteBoard(date);
  }

  async getAllSavedDates(): Promise<string[]> {
    return await this.indexedDb.getAllDates();
  }

  moveCard(event: CdkDragDrop<Card[]>): void {
    const currentBoard = this.boardState();
    if (!currentBoard) return;
    
    // Find list indices using container IDs
    const previousListIndex = currentBoard.lists.findIndex(
      list => list.id === event.previousContainer.id
    );
    const currentListIndex = currentBoard.lists.findIndex(
      list => list.id === event.container.id
    );

    // Validate indices
    if (previousListIndex === -1 || currentListIndex === -1) {
      console.error('Could not find source or target list');
      return;
    }

    // Create deep copies of the lists
    const updatedLists = currentBoard.lists.map(list => ({
      ...list,
      cards: [...list.cards]
    }));

    if (event.previousContainer === event.container) {
      moveItemInArray(
        updatedLists[currentListIndex].cards,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        updatedLists[previousListIndex].cards,
        updatedLists[currentListIndex].cards,
        event.previousIndex,
        event.currentIndex
      );
      
      // Update card status based on target list
      const movedCard = updatedLists[currentListIndex].cards[event.currentIndex];
      const targetListStatus = updatedLists[currentListIndex].status;
      if (movedCard && targetListStatus) {
        updatedLists[currentListIndex].cards[event.currentIndex] = {
          ...movedCard,
          status: targetListStatus
        };
      }
    }

    const updatedBoard = {
      ...currentBoard,
      lists: updatedLists
    };
    this.updateBoardState(updatedBoard);
    this.saveBoardToIndexedDB(updatedBoard);
  }

  exportBoardToJson(): string {
    const currentBoard = this.boardState();
    if (!currentBoard) return '{}';
    return JSON.stringify(currentBoard, null, 2);
  }

  importBoardFromJson(jsonString: string): void {
    try {
      const parsedBoard = JSON.parse(jsonString) as Board;

      if (!parsedBoard.id || !parsedBoard.title || !Array.isArray(parsedBoard.lists)) {
        throw new Error('Invalid board structure');
      }

      for (const list of parsedBoard.lists) {
        if (!list.id || !list.title || !Array.isArray(list.cards)) {
          throw new Error('Invalid list structure');
        }

        for (const card of list.cards) {
          if (!card.id || !card.title) {
            throw new Error('Invalid card structure');
          }
        }
      }

      this.updateBoardState(parsedBoard);
    } catch (error) {
      console.error('Failed to import board:', error);
      throw new Error('Invalid JSON format. Please provide a valid board JSON file.');
    }
  }

  addCard(listId: string, title: string, description: string, type: CardType): void {
    const currentBoard = this.boardState();
    if (!currentBoard) return;
    const listIndex = currentBoard.lists.findIndex(list => list.id === listId);

    if (listIndex === -1) {
      console.error(`List with id ${listId} not found`);
      return;
    }

    const targetList = currentBoard.lists[listIndex];
    const newCard: Card = {
      id: `card-${Date.now()}`,
      title,
      description,
      type,
      status: targetList.status
    };

    const updatedLists = currentBoard.lists.map((list, index) => {
      if (index === listIndex) {
        return {
          ...list,
          cards: [...list.cards, newCard]
        };
      }
      return list;
    });

    const updatedBoard = {
      ...currentBoard,
      lists: updatedLists
    };
    this.updateBoardState(updatedBoard);
    this.saveBoardToIndexedDB(updatedBoard);
  }

  exportBoardWithDate(date?: string): string {
    const currentBoard = this.boardState();
    if (!currentBoard) return '{}';
    const boardToExport: Board = {
      ...currentBoard,
      date: date || this.getTodayDateISO()
    };
    return JSON.stringify(boardToExport, null, 2);
  }

  updateBoardDate(date: string): void {
    const currentBoard = this.boardState();
    if (!currentBoard) return;
    const updatedBoard = {
      ...currentBoard,
      date
    };
    this.updateBoardState(updatedBoard);
    this.saveBoardToIndexedDB(updatedBoard);
  }

  getBoardsByDateRange(startDate: string, endDate: string): Board[] {
    // This would typically fetch from a backend/storage
    // For now, return current board if date matches
    const currentBoard = this.boardState();
    if (currentBoard && currentBoard.date && currentBoard.date >= startDate && currentBoard.date <= endDate) {
      return [currentBoard];
    }
    return [];
  }
}
