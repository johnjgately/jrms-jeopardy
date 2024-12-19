import { QuestionBank, GameQuestions } from '../types/game';

const STORAGE_KEY = 'jeopardy_question_banks';

export const saveQuestionBank = (name: string, questions: GameQuestions): void => {
  const banks = getQuestionBanks();
  const newBank: QuestionBank = {
    id: crypto.randomUUID(),
    name,
    dateCreated: new Date().toISOString(),
    questions,
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...banks, newBank]));
};

export const getQuestionBanks = (): QuestionBank[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const deleteQuestionBank = (id: string): void => {
  const banks = getQuestionBanks();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(banks.filter((bank) => bank.id !== id))
  );
};