import { useState } from 'react';
import { GameState, CustomQuestionSet, Player, GameQuestions } from './types/game';
import SetupScreen from './components/Setup/SetupScreen';
import QuestionForm from './components/QuestionBank/QuestionForm';
import QuestionBankList from './components/QuestionBank/QuestionBankList';
import PlayerSetup from './components/PlayerSetup';
import GameScreen from './components/Game/GameScreen';
import { loadCustomQuestionSets } from './utils/storage';

type GameMode = 'setup' | 'create' | 'play' | 'player-setup';

export default function App() {
  const [mode, setMode] = useState<GameMode>('setup');
  const [selectedBank, setSelectedBank] = useState<CustomQuestionSet | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    round: 1,
    players: [],
    categories: [],
    currentQuestion: null,
    isGameStarted: false,
    isRoundComplete: false,
  });

  const handleCreateQuestions = () => {
    setMode('setup');
  };

  const handleSelectQuestionBank = (bank: CustomQuestionSet) => {
    setSelectedBank(bank);
    setMode('player-setup');
  };

  const handlePlayClick = (questions?: GameQuestions) => {
    if (questions) {
      // If questions are provided (default set), create a temporary CustomQuestionSet
      setSelectedBank({
        id: 'default',
        name: 'US Military History (Default)',
        dateCreated: new Date().toISOString(),
        questions: questions
      });
      setMode('player-setup');
    } else {
      setMode('play');
    }
  };

  const handlePlayersConfirmed = (players: Player[]) => {
    if (selectedBank) {
      setGameState((prev) => ({
        ...prev,
        players,
        categories: selectedBank.questions.round1,
        isGameStarted: true,
      }));
      setMode('play');
    }
  };

  if (mode === 'setup') {
    return <SetupScreen onCreateClick={() => setMode('create')} onPlayClick={handlePlayClick} />;
  }

  if (mode === 'create') {
    return <QuestionForm onSave={handleCreateQuestions} onCancel={() => setMode('setup')} />;
  }

  if (mode === 'play' && !selectedBank) {
    return <QuestionBankList questionBanks={loadCustomQuestionSets()} onSelect={handleSelectQuestionBank} />;
  }

  if (mode === 'player-setup') {
    return <PlayerSetup onPlayersConfirmed={handlePlayersConfirmed} />;
  }

  return <GameScreen gameState={gameState} setGameState={setGameState} selectedBank={selectedBank!} />;
}