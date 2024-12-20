import { useState } from 'react';
import { motion } from 'framer-motion';
import { GameQuestions } from '../../types/game';
import { saveCustomQuestionSet } from '../../utils/storage';

interface QuestionFormProps {
  onSave: () => void;
  onCancel: () => void;
}

interface CategoryForm {
  name: string;
  questions: {
    question: string;
    answer: string;
    value: number;
  }[];
}

const QUESTION_VALUES = [400, 800, 1200, 1600, 2000];

export default function QuestionForm({ onSave, onCancel }: QuestionFormProps) {
  const [setName, setSetName] = useState('');
  const [round1Categories, setRound1Categories] = useState<CategoryForm[]>(
    Array(6).fill(null).map(() => ({
      name: '',
      questions: QUESTION_VALUES.map(value => ({
        question: '',
        answer: '',
        value,
      })),
    }))
  );

  const [round2Categories, setRound2Categories] = useState<CategoryForm[]>(
    Array(6).fill(null).map(() => ({
      name: '',
      questions: QUESTION_VALUES.map(value => ({
        question: '',
        answer: '',
        value: value * 2,
      })),
    }))
  );

  const handleSave = () => {
    if (!setName.trim()) {
      alert('Please enter a name for your question set');
      return;
    }

    // Validate all categories have names
    if ([...round1Categories, ...round2Categories].some(cat => !cat.name.trim())) {
      alert('All categories must have names');
      return;
    }

    // Validate all questions and answers are filled
    if ([...round1Categories, ...round2Categories].some(cat =>
      cat.questions.some(q => !q.question.trim() || !q.answer.trim())
    )) {
      alert('All questions and answers must be filled out');
      return;
    }

    // Convert form data to GameQuestions format
    const gameQuestions: GameQuestions = {
      round1: round1Categories.map(cat => ({
        id: crypto.randomUUID(),
        name: cat.name,
        questions: cat.questions.map(q => ({
          id: crypto.randomUUID(),
          category: cat.name,
          ...q,
          isAnswered: false,
          isDouble: false,
        })),
      })),
      round2: round2Categories.map(cat => ({
        id: crypto.randomUUID(),
        name: cat.name,
        questions: cat.questions.map(q => ({
          id: crypto.randomUUID(),
          category: cat.name,
          ...q,
          isAnswered: false,
          isDouble: false,
        })),
      })),
    };

    // Save the question set
    saveCustomQuestionSet(setName, gameQuestions);
    onSave();
  };

  const updateCategory = (roundCategories: CategoryForm[], setRoundCategories: React.Dispatch<React.SetStateAction<CategoryForm[]>>, categoryIndex: number, field: keyof CategoryForm, value: string) => {
    const newCategories = [...roundCategories];
    if (field === 'name') {
      newCategories[categoryIndex].name = value;
    }
    setRoundCategories(newCategories);
  };

  const updateQuestion = (roundCategories: CategoryForm[], setRoundCategories: React.Dispatch<React.SetStateAction<CategoryForm[]>>, categoryIndex: number, questionIndex: number, field: keyof Omit<CategoryForm['questions'][0], 'value'>, value: string) => {
    const newCategories = [...roundCategories];
    newCategories[categoryIndex].questions[questionIndex][field] = value;
    setRoundCategories(newCategories);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-gradient-to-b from-blue-900 to-blue-950 min-h-screen text-yellow-400"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold mb-8 text-center"
        >
          Create Question Set
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <label className="block text-xl mb-2">Question Set Name</label>
          <input
            type="text"
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            className="w-full p-3 bg-blue-800 rounded-md border-2 border-yellow-400 text-yellow-400 placeholder-yellow-600"
            placeholder="Enter a name for your question set"
          />
        </motion.div>

        {[
          { round: 1, categories: round1Categories, setCategories: setRound1Categories },
          { round: 2, categories: round2Categories, setCategories: setRound2Categories }
        ].map(({ round, categories, setCategories }) => (
          <motion.div
            key={round}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-12"
          >
            <h3 className="text-3xl font-bold mb-6">Round {round}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, categoryIndex) => (
                <motion.div
                  key={categoryIndex}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                  className="bg-blue-800 rounded-lg p-4 border-2 border-yellow-400"
                >
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => updateCategory(categories, setCategories, categoryIndex, 'name', e.target.value)}
                    className="w-full p-2 mb-4 bg-blue-700 rounded border-2 border-yellow-400 text-yellow-400 placeholder-yellow-600"
                    placeholder={`Category ${categoryIndex + 1}`}
                  />
                  {category.questions.map((q, questionIndex) => (
                    <div key={questionIndex} className="mb-4">
                      <div className="text-sm font-bold mb-1">${q.value}</div>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => updateQuestion(categories, setCategories, categoryIndex, questionIndex, 'question', e.target.value)}
                        className="w-full p-2 mb-2 bg-blue-700 rounded border-2 border-yellow-400 text-yellow-400 placeholder-yellow-600"
                        placeholder="Question"
                      />
                      <input
                        type="text"
                        value={q.answer}
                        onChange={(e) => updateQuestion(categories, setCategories, categoryIndex, questionIndex, 'answer', e.target.value)}
                        className="w-full p-2 bg-blue-700 rounded border-2 border-yellow-400 text-yellow-400 placeholder-yellow-600"
                        placeholder="Answer"
                      />
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-end gap-4 mt-8"
        >
          <motion.button
            onClick={onCancel}
            className="jeopardy-button bg-red-600 hover:bg-red-700 border-red-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={handleSave}
            className="jeopardy-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Save Question Set
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}