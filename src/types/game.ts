// ... existing types ...

export interface GameQuestions {
  round1: Category[];
  round2: Category[];
}

export interface QuestionBank {
  id: string;
  name: string;
  dateCreated: string;
  questions: GameQuestions;
}