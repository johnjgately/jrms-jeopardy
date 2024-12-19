import React, { useState } from 'react';
import { GameState, QuestionBank } from './types/game';
import SetupScreen from './components/Setup/SetupScreen';
import QuestionForm from './components/QuestionBank/QuestionForm';
import QuestionBankList from './components/QuestionBank/QuestionBankList';
import PlayerSetup from './components/PlayerSetup';
import GameScreen from './components/Game/GameScreen';
import { saveQuestionBank, getQuestionBanks } from './utils/storage';

type GameMode = 'setup' | 'create' | 'play' | 'player-setup';

export default function App() {
  const [mode, setMode] = useState<GameMode>('setup');
  const [selectedBank, setSelectedBank] = useState<QuestionBank | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    round: 1,
    players: [],
    categories: [],
    currentQuestion: null,
    isGameStarted: false,
    isRoundComplete: false,
  });

  const handleCreateQuestions = (questions: GameQuestions) => {
    const name = prompt('Enter a name for this question set:');
    if (name) {
      saveQuestionBank(name, questions);
      setMode('setup');
    }
  };

  const handleSelectQuestionBank = (bank: QuestionBank) => {
    setSelectedBank(bank);
    setMode('player-setup');
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
    return <SetupScreen onCreateClick={() => setMode('create')} onPlayClick={() => setMode('play')} />;
  }

  if (mode === 'create') {
    return <QuestionForm onSave={handleCreateQuestions} />;
  }

  if (mode === 'play' && !selectedBank) {
    return <QuestionBankList questionBanks={getQuestionBanks()} onSelect={handleSelectQuestionBank} />;
  }

  if (mode === 'player-setup') {
    return <PlayerSetup onPlayersConfirmed={handlePlayersConfirmed} />;
  }

  return <GameScreen gameState={gameState} setGameState={setGameState} selectedBank={selectedBank!} />;
}