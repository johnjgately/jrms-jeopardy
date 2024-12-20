// ... existing types ...

export interface Question {
  id: string;
  category: string;
  question: string;
  answer: string;
  value: number;
  isAnswered: boolean;
  isDouble: boolean;
}

export interface Category {
  id: string;
  name: string;
  questions: Question[];
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface GameState {
  round: number;
  players: Player[];
  categories: Category[];
  currentQuestion: Question | null;
  isGameStarted: boolean;
  isRoundComplete: boolean;
}

export interface GameQuestions {
  round1: Category[];
  round2: Category[];
}

export interface CustomQuestionSet {
  id: string;
  name: string;
  dateCreated: string;
  questions: GameQuestions;
}