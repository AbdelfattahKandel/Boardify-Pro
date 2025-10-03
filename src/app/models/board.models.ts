export type CardType = 'task' | 'report';
export type CardStatus = 'todo' | 'in-progress' | 'done';

export interface Card {
  id: string;
  title: string;
  description?: string;
  type?: CardType;
  status?: CardStatus;
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
  status?: CardStatus;
}

export interface Board {
  id: string;
  title: string;
  lists: List[];
  date?: string;
}
