import React from 'react';
import { QuestionBank } from '../../types/game';

interface QuestionBankListProps {
  questionBanks: QuestionBank[];
  onSelect: (bank: QuestionBank) => void;
}

export default function QuestionBankList({
  questionBanks,
  onSelect,
}: QuestionBankListProps) {
  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Select Question Set</h2>
      <div className="space-y-4">
        {questionBanks.map((bank) => (
          <button
            key={bank.id}
            onClick={() => onSelect(bank)}
            className="w-full p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="font-bold">{bank.name}</div>
            <div className="text-sm text-gray-500">
              Created: {new Date(bank.dateCreated).toLocaleDateString()}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}