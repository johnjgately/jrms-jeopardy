import React, { useState } from 'react';
import { Category, GameQuestions } from '../../types/game';

interface QuestionFormProps {
  onSave: (questions: GameQuestions) => void;
}

export default function QuestionForm({ onSave }: QuestionFormProps) {
  const [currentRound, setCurrentRound] = useState<1 | 2>(1);
  const [round1, setRound1] = useState<Category[]>([]);
  const [round2, setRound2] = useState<Category[]>([]);
  const [error, setError] = useState<string>('');

  const baseValues = {
    1: [200, 400, 600, 800, 1000],
    2: [400, 800, 1200, 1600, 2000],
  };

  const validateQuestions = (categories: Category[]): boolean => {
    if (categories.length !== 6) return false;
    return categories.every(category => 
      category.questions.every(q => q.question.trim() && q.answer.trim())
    );
  };

  const handleSave = () => {
    if (!validateQuestions(round1) || !validateQuestions(round2)) {
      setError('Please complete all categories and questions for both rounds');
      return;
    }
    
    onSave({ round1, round2 });
  };

  const createEmptyCategory = (name: string, roundNum: 1 | 2): Category => ({
    id: crypto.randomUUID(),
    name,
    questions: baseValues[roundNum].map(value => ({
      id: crypto.randomUUID(),
      category: name,
      question: '',
      answer: '',
      value,
      isAnswered: false,
      isDouble: false,
    })),
  });

  const updateQuestion = (
    roundNum: 1 | 2,
    categoryIndex: number,
    questionIndex: number,
    field: 'question' | 'answer',
    value: string
  ) => {
    const setRound = roundNum === 1 ? setRound1 : setRound2;
    const round = roundNum === 1 ? round1 : round2;

    setRound(
      round.map((category, cIndex) =>
        cIndex === categoryIndex
          ? {
              ...category,
              questions: category.questions.map((q, qIndex) =>
                qIndex === questionIndex ? { ...q, [field]: value } : q
              ),
            }
          : category
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div className="space-x-4">
          <button
            onClick={() => setCurrentRound(1)}
            className={`px-4 py-2 rounded-md ${
              currentRound === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Round 1
          </button>
          <button
            onClick={() => setCurrentRound(2)}
            className={`px-4 py-2 rounded-md ${
              currentRound === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Round 2
          </button>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Save Questions
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, categoryIndex) => {
          const round = currentRound === 1 ? round1 : round2;
          const setRound = currentRound === 1 ? setRound1 : setRound2;
          const category = round[categoryIndex];

          return (
            <div key={categoryIndex} className="border p-4 rounded-lg">
              <input
                type="text"
                value={category?.name || ''}
                onChange={(e) => {
                  const newCategories = [...round];
                  if (!category) {
                    newCategories[categoryIndex] = createEmptyCategory(
                      e.target.value,
                      currentRound
                    );
                  } else {
                    newCategories[categoryIndex] = {
                      ...category,
                      name: e.target.value,
                    };
                  }
                  setRound(newCategories);
                }}
                placeholder="Category Name"
                className="w-full p-2 border rounded-md mb-4"
              />
              {category?.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="mb-4">
                  <div className="font-bold mb-2">
                    ${baseValues[currentRound][questionIndex]}
                  </div>
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) =>
                      updateQuestion(
                        currentRound,
                        categoryIndex,
                        questionIndex,
                        'question',
                        e.target.value
                      )
                    }
                    placeholder="Question"
                    className="w-full p-2 border rounded-md mb-2"
                  />
                  <input
                    type="text"
                    value={question.answer}
                    onChange={(e) =>
                      updateQuestion(
                        currentRound,
                        categoryIndex,
                        questionIndex,
                        'answer',
                        e.target.value
                      )
                    }
                    placeholder="Answer"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}