import React from 'react';
import { GameState, QuestionBank } from '../../types/game';
import GameBoard from '../GameBoard';
import QuestionModal from '../QuestionModal';

interface GameScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  selectedBank: QuestionBank;
}

export default function GameScreen({ gameState, setGameState, selectedBank }: GameScreenProps) {
  const handleQuestionSelect = (question: Question) => {
    setGameState((prev) => ({
      ...prev,
      currentQuestion: question,
    }));
  };

  const handleQuestionAnswer = (playerId: string | null) => {
    setGameState((prev) => {
      const updatedCategories = prev.categories.map((category) => ({
        ...category,
        questions: category.questions.map((q) =>
          q.id === prev.currentQuestion?.id ? { ...q, isAnswered: true } : q
        ),
      }));

      const updatedPlayers = prev.players.map((player) => {
        if (player.id === playerId && prev.currentQuestion) {
          return {
            ...player,
            score: player.score + (prev.currentQuestion.isDouble
              ? prev.currentQuestion.value * 2
              : prev.currentQuestion.value),
          };
        }
        return player;
      });

      const isRoundComplete = updatedCategories.every((category) =>
        category.questions.every((q) => q.isAnswered)
      );

      if (isRoundComplete && prev.round === 1) {
        return {
          ...prev,
          categories: selectedBank.questions.round2,
          players: updatedPlayers,
          currentQuestion: null,
          isRoundComplete: false,
          round: 2,
        };
      }

      return {
        ...prev,
        categories: updatedCategories,
        players: updatedPlayers,
        currentQuestion: null,
        isRoundComplete,
      };
    });
  };

  return (
    <>
      <GameBoard
        categories={gameState.categories}
        onQuestionSelect={handleQuestionSelect}
        players={gameState.players}
        round={gameState.round}
      />
      {gameState.currentQuestion && (
        <QuestionModal
          question={gameState.currentQuestion}
          players={gameState.players}
          onAnswer={handleQuestionAnswer}
          onClose={() => setGameState((prev) => ({ ...prev, currentQuestion: null }))}
        />
      )}
    </>
  );
}