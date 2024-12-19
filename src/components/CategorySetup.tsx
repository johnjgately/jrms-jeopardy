import React, { useState } from 'react';
import { Category, Question } from '../types/game';

interface CategorySetupProps {
  onCategoriesConfirmed: (categories: Category[]) => void;
  round: number;
}

export default function CategorySetup({
  onCategoriesConfirmed,
  round,
}: CategorySetupProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const baseValues = round === 1 ? [200, 400, 600, 800, 1000] : [400, 800, 1200, 1600, 2000];

  const handleAddCategory = () => {
    if (currentCategory.trim() && categories.length < 6) {
      const questions: Question[] = baseValues.map((value) => ({
        id: crypto.randomUUID(),
        category: currentCategory,
        question: '',
        answer: '',
        value,
        isAnswered: false,
        isDouble: false,
      }));

      const newCategory: Category = {
        id: crypto.randomUUID(),
        name: currentCategory.trim(),
        questions,
      };

      setCategories([...categories, newCategory]);
      setCurrentCategory('');
    }
  };

  const updateQuestion = (
    categoryId: string,
    questionId: string,
    field: 'question' | 'answer',
    value: string
  ) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            questions: category.questions.map((q) => {
              if (q.id === questionId) {
                return { ...q, [field]: value };
              }
              return q;
            }),
          };
        }
        return category;
      })
    );
  };

  const handleConfirm = () => {
    if (categories.length === 6) {
      // Set random double questions
      const updatedCategories = categories.map((category) => {
        const randomIndex = Math.floor(Math.random() * category.questions.length);
        return {
          ...category,
          questions: category.questions.map((q, index) => ({
            ...q,
            isDouble: index === randomIndex,
          })),
        };
      });
      onCategoriesConfirmed(updatedCategories);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Round {round} Setup</h2>

      {categories.length < 6 && (
        <div className="mb-6">
          <input
            type="text"
            value={currentCategory}
            onChange={(e) => setCurrentCategory(e.target.value)}
            placeholder="Enter category name"
            className="p-2 border rounded-md mr-2"
          />
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Add Category
          </button>
        </div>
      )}

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.id} className="border p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-4">{category.name}</h3>
            {category.questions.map((question) => (
              <div key={question.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="font-bold mb-2">${question.value}</div>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) =>
                    updateQuestion(
                      category.id,
                      question.id,
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
                      category.id,
                      question.id,
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
        ))}
      </div>

      {categories.length === 6 && (
        <button
          onClick={handleConfirm}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Start Round
        </button>
      )}
    </div>
  );
}