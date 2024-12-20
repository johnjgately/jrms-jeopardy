import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadCustomQuestionSets, deleteCustomQuestionSet, exportQuestionSet, importQuestionSet } from '../../utils/storage';
import { GameQuestions, CustomQuestionSet } from '../../types/game';
import { getDefaultQuestions } from '../../utils/defaultQuestions';

interface QuestionSetListProps {
  onSelectSet: (questions: GameQuestions) => void;
  onCreateNew: () => void;
  onBack: () => void;
}

export default function QuestionSetList({ onSelectSet, onCreateNew, onBack }: QuestionSetListProps) {
  const [questionSets, setQuestionSets] = useState(loadCustomQuestionSets());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuestionSets(loadCustomQuestionSets());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this question set?')) {
      deleteCustomQuestionSet(id);
      setQuestionSets(loadCustomQuestionSets());
    }
  };

  const handleExport = (set: CustomQuestionSet) => {
    const jsonString = exportQuestionSet(set);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${set.name.replace(/\s+/g, '_')}_questions.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        const importedSet = importQuestionSet(content);
        if (importedSet) {
          setQuestionSets(loadCustomQuestionSets());
        } else {
          alert('Invalid question set file format');
        }
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-gradient-to-b from-blue-900 to-blue-950 min-h-screen"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.button
            onClick={onBack}
            className="jeopardy-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back
          </motion.button>
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-yellow-400 text-4xl font-bold text-center"
          >
            Question Sets
          </motion.h2>
          <div className="flex gap-2">
            <motion.button
              onClick={handleImport}
              className="jeopardy-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Import
            </motion.button>
            <motion.button
              onClick={onCreateNew}
              className="jeopardy-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create New
            </motion.button>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".json"
          className="hidden"
        />

        <div className="grid gap-4">
          {/* Default Question Set */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-blue-800 rounded-lg p-4 border-2 border-yellow-400"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-yellow-400 text-xl font-bold">US Military History (Default)</h3>
                <p className="text-yellow-200 text-sm">
                  Default question set included with the game
                </p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  onClick={() => handleExport({
                    id: 'default',
                    name: 'US Military History (Default)',
                    dateCreated: new Date().toISOString(),
                    questions: getDefaultQuestions()
                  })}
                  className="jeopardy-button px-4 py-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Export
                </motion.button>
                <motion.button
                  onClick={() => onSelectSet(getDefaultQuestions())}
                  className="jeopardy-button px-4 py-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Play
                </motion.button>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {questionSets.map((set, index) => (
              <motion.div
                key={set.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-blue-800 rounded-lg p-4 border-2 border-yellow-400"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-yellow-400 text-xl font-bold">{set.name}</h3>
                    <p className="text-yellow-200 text-sm">
                      Created: {new Date(set.dateCreated).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleExport(set)}
                      className="jeopardy-button px-4 py-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Export
                    </motion.button>
                    <motion.button
                      onClick={() => onSelectSet(set.questions)}
                      className="jeopardy-button px-4 py-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Play
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(set.id)}
                      className="jeopardy-button bg-red-600 hover:bg-red-700 border-red-400 px-4 py-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {questionSets.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-yellow-200 py-8"
            >
              No custom question sets yet. Create one to get started!
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 