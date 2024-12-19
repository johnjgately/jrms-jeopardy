import React, { useState } from 'react';
import { Question, Player } from '../types/game';

interface QuestionModalProps {
  question: Question;
  players: Player[];
  onAnswer: (playerId: string | null) => void;
  onClose: () => void;
}

export default function QuestionModal({
  question,
  players,
  onAnswer,
  onClose,
}: QuestionModalProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">
            ${question.value} {question.isDouble && '(Double!)'}
          </h3>
          <p className="text-lg">{question.question}</p>
        </div>

        {!showAnswer ? (
          <button
            onClick={() => setShowAnswer(true)}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-4"
          >
            Show Answer
          </button>
        ) : (
          <>
            <div className="mb-4 p-4 bg-gray-100 rounded-lg">
              <p className="font-bold">Answer: {question.answer}</p>
            </div>
            <div className="space-y-2">
              {players.map((player) => (
                <button
                  key={player.id}
                  onClick={() => onAnswer(player.id)}
                  className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Correct: {player.name}
                </button>
              ))}
              <button
                onClick={() => onAnswer(null)}
                className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Nobody Correct
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}