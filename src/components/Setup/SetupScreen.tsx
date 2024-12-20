import { useState } from 'react';
import { motion } from 'framer-motion';
import QuestionSetList from './QuestionSetList';
import { GameQuestions } from '../../types/game';
import { getDefaultQuestions } from '../../utils/defaultQuestions';
import '../../styles/jeopardy-theme.css';

interface SetupScreenProps {
  onCreateClick: () => void;
  onPlayClick: (questions?: GameQuestions) => void;
}

export default function SetupScreen({ onCreateClick, onPlayClick }: SetupScreenProps) {
  const [showQuestionSets, setShowQuestionSets] = useState(false);

  if (showQuestionSets) {
    return (
      <QuestionSetList
        onSelectSet={(questions) => onPlayClick(questions)}
        onCreateNew={onCreateClick}
        onBack={() => setShowQuestionSets(false)}
      />
    );
  }

  return (
    <motion.div 
      className="start-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className="game-title"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
      >
        TMD
        <br />
        Jeopardy
      </motion.h1>

      <motion.div 
        className="start-buttons"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.button
          className="start-button"
          onClick={() => onPlayClick(getDefaultQuestions())}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Play Game
        </motion.button>

        <motion.button
          className="start-button"
          onClick={() => setShowQuestionSets(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Manage Question Sets
        </motion.button>
      </motion.div>

      <motion.div
        className="absolute bottom-4 text-yellow-400 text-lg font-korinna"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
      </motion.div>
    </motion.div>
  );
}