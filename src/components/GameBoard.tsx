import React from 'react';
import { Category, Question, Player } from '../types/game';

interface GameBoardProps {
  categories: Category[];
  onQuestionSelect: (question: Question) => void;
  players: Player[];
  round: number;
}

export default function GameBoard({
  categories,
  onQuestionSelect,
  players,
  round,
}: GameBoardProps) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Round {round}
        </h2>
        <div className="flex justify-around mb-4">
          {players.map((player) => (
            <div
              key={player.id}
              className="text-center p-3 bg-white rounded-lg shadow"
            >
              <div className="font-bold">{player.name}</div>
              <div className="text-xl">${player.score}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="space-y-4">
            <div className="h-20 flex items-center justify-center bg-blue-600 text-white p-2 rounded-lg font-bold text-center">
              {category.name}
            </div>
            {category.questions.map((question) => (
              <button
                key={question.id}
                onClick={() => !question.isAnswered && onQuestionSelect(question)}
                className={`w-full h-20 ${
                  question.isAnswered
                    ? 'bg-gray-300'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white font-bold rounded-lg transition-colors`}
                disabled={question.isAnswered}
              >
                ${question.value}
                {question.isDouble && '★'}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}