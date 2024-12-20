import { GameQuestions } from '../types/game';

const STORAGE_KEYS = {
  PLAYERS: 'jeopardy_players',
  CURRENT_GAME: 'jeopardy_current_game',
  CUSTOM_QUESTION_SETS: 'jeopardy_custom_question_sets'
} as const;

interface CustomQuestionSet {
  id: string;
  name: string;
  dateCreated: string;
  questions: GameQuestions;
}

export const savePlayers = (players: any[]) => {
  localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
};

export const loadPlayers = () => {
  const players = localStorage.getItem(STORAGE_KEYS.PLAYERS);
  return players ? JSON.parse(players) : [];
};

export const saveCurrentGame = (game: any) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_GAME, JSON.stringify(game));
};

export const loadCurrentGame = () => {
  const game = localStorage.getItem(STORAGE_KEYS.CURRENT_GAME);
  return game ? JSON.parse(game) : null;
};

export const saveCustomQuestionSet = (name: string, questions: GameQuestions) => {
  const existingSets = loadCustomQuestionSets();
  
  const newSet: CustomQuestionSet = {
    id: crypto.randomUUID(),
    name,
    dateCreated: new Date().toISOString(),
    questions
  };

  existingSets.push(newSet);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTION_SETS, JSON.stringify(existingSets));
  return newSet;
};

export const loadCustomQuestionSets = (): CustomQuestionSet[] => {
  const sets = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTION_SETS);
  return sets ? JSON.parse(sets) : [];
};

export const deleteCustomQuestionSet = (id: string): boolean => {
  const existingSets = loadCustomQuestionSets();
  const updatedSets = existingSets.filter(set => set.id !== id);
  
  if (updatedSets.length === existingSets.length) {
    return false; // Set not found
  }
  
  localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTION_SETS, JSON.stringify(updatedSets));
  return true;
};

export const updateCustomQuestionSet = (id: string, updates: Partial<Omit<CustomQuestionSet, 'id' | 'dateCreated'>>) => {
  const existingSets = loadCustomQuestionSets();
  const setIndex = existingSets.findIndex(set => set.id === id);
  
  if (setIndex === -1) {
    return false;
  }
  
  existingSets[setIndex] = {
    ...existingSets[setIndex],
    ...updates,
  };
  
  localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTION_SETS, JSON.stringify(existingSets));
  return true;
};

export const exportQuestionSet = (set: CustomQuestionSet): string => {
  const exportData = {
    ...set,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
  return JSON.stringify(exportData, null, 2);
};

export const importQuestionSet = (jsonString: string): CustomQuestionSet | null => {
  try {
    const importedData = JSON.parse(jsonString);
    
    // Validate the imported data has the required structure
    if (!importedData.name || !importedData.questions || 
        !importedData.questions.round1 || !importedData.questions.round2) {
      return null;
    }

    // Create a new question set with a new ID
    const newSet: CustomQuestionSet = {
      id: crypto.randomUUID(),
      name: `${importedData.name} (Imported)`,
      dateCreated: new Date().toISOString(),
      questions: importedData.questions
    };

    // Save to storage
    const existingSets = loadCustomQuestionSets();
    existingSets.push(newSet);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTION_SETS, JSON.stringify(existingSets));

    return newSet;
  } catch (error) {
    console.error('Error importing question set:', error);
    return null;
  }
};