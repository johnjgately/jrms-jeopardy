import { motion, AnimatePresence } from 'framer-motion';
import { Category, Question, Player } from '../types/game';
import useSound from 'use-sound';
import { useEffect, useRef } from 'react';
import '../styles/jeopardy-theme.css';

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
  const [playSelect] = useSound('/sounds/select.mp3', { volume: 0.5 });
  const [playReveal] = useSound('/sounds/reveal.mp3', { volume: 0.5 });
  const categoryRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const handleQuestionClick = (question: Question) => {
    if (!question.isAnswered) {
      playSelect();
      onQuestionSelect(question);
    }
  };

  useEffect(() => {
    const updateScales = () => {
      categoryRefs.current.forEach((span) => {
        if (span && span.parentElement) {
          const parent = span.parentElement;
          const parentWidth = parent.clientWidth - 20;
          const parentHeight = parent.clientHeight - 20;
          const spanWidth = span.scrollWidth;
          const spanHeight = span.scrollHeight;
          
          const widthScale = parentWidth / spanWidth;
          const heightScale = parentHeight / spanHeight;
          const scale = Math.min(widthScale, heightScale, 1);
          
          if (scale < 1) {
            span.style.transform = `scale(${scale})`;
          } else {
            span.style.transform = 'none';
          }
        }
      });
    };

    const timer = setTimeout(updateScales, 100);
    window.addEventListener('resize', updateScales);
    document.fonts.ready.then(updateScales);

    return () => {
      window.removeEventListener('resize', updateScales);
      clearTimeout(timer);
    };
  }, [categories]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 min-h-screen bg-gradient-to-b from-blue-900 to-blue-950"
    >
      <motion.h2
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="round-title"
      >
        Round {round}
      </motion.h2>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="scoreboard"
      >
        {players.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.2 }}
            className="player-score"
          >
            <div className="name">{player.name}</div>
            <div className="score">${player.score.toLocaleString()}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="jeopardy-board"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-6 gap-4">
          <AnimatePresence>
            {categories.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="space-y-4"
              >
                <motion.div
                  className="category-cell"
                  whileHover={{ scale: 1.02 }}
                  onMouseEnter={() => playReveal()}
                >
                  <span ref={el => categoryRefs.current[categoryIndex] = el}>
                    {category.name}
                  </span>
                </motion.div>
                {category.questions.map((question: Question, questionIndex: number) => (
                  <motion.button
                    key={question.id}
                    onClick={() => handleQuestionClick(question)}
                    className={`question-cell ${question.isAnswered ? 'answered' : ''}`}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: (categoryIndex * 5 + questionIndex) * 0.05,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    whileHover={!question.isAnswered ? { scale: 1.05 } : {}}
                  >
                    {!question.isAnswered && (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <span>${question.value.toLocaleString()}</span>
                      </div>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}