import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, Player } from '../types/game';
import useSound from 'use-sound';

interface QuestionModalProps {
  question: Question;
  players: Player[];
  onAnswer: (playerId: string | null, wagerAmount?: number) => void;
  onClose: () => void;
}

export default function QuestionModal({
  question,
  players,
  onAnswer,
  onClose,
}: QuestionModalProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showQuestion, setShowQuestion] = useState(!question.isDouble);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [wager, setWager] = useState<string>('');
  const [playThink, { stop: stopThink }] = useSound('/sounds/think.mp3', { 
    volume: 0.5,
    interrupt: true,
  });
  const [playReveal] = useSound('/sounds/reveal.mp3', { volume: 0.5 });
  const [playCorrect] = useSound('/sounds/correct.mp3', { volume: 0.5 });
  const [playWrong] = useSound('/sounds/wrong.mp3', { volume: 0.5 });
  const [playDouble] = useSound('/sounds/double.mp3', { volume: 0.5 });

  useEffect(() => {
    if (question.isDouble) {
      playDouble();
    } else {
      playThink();
    }
    return () => {
      stopThink();
    };
  }, [playThink, stopThink, question.isDouble, playDouble]);

  const handleShowAnswer = () => {
    stopThink();
    playReveal();
    setShowAnswer(true);
  };

  const handlePlayerAnswer = (playerId: string | null) => {
    stopThink();
    if (playerId) {
      playCorrect();
    } else {
      playWrong();
    }
    onAnswer(playerId, question.isDouble ? parseInt(wager) : undefined);
    onClose();
  };

  const getMaxWager = (playerId: string): number => {
    const player = players.find(p => p.id === playerId);
    if (!player) return 0;
    
    // In Jeopardy, players can wager up to their total score, or the maximum value on the board
    const maxValue = 2000; // Maximum value in the current round
    return Math.max(maxValue, player.score);
  };

  const handleWagerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer) return;
    
    const wagerAmount = parseInt(wager);
    if (isNaN(wagerAmount) || wagerAmount <= 0) {
      alert('Please enter a valid wager amount');
      return;
    }

    const maxWager = getMaxWager(selectedPlayer);
    if (wagerAmount > maxWager) {
      alert(`Maximum wager is $${maxWager.toLocaleString()}`);
      return;
    }
    if (wagerAmount < 5) {
      alert('Minimum wager is $5');
      return;
    }

    // Set the question value to the wager amount and show the question
    question.value = wagerAmount;
    setShowQuestion(true);
    playThink();
  };

  const handleTrueDailyDouble = () => {
    if (!selectedPlayer) return;
    const maxWager = getMaxWager(selectedPlayer);
    setWager(maxWager.toString());
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="question-modal bg-gradient-to-b from-blue-900 to-blue-950 rounded-lg p-8 max-w-4xl w-full shadow-2xl border-4 border-yellow-400"
        >
          <div className="flex justify-end mb-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                stopThink();
                onClose();
              }}
              className="text-yellow-400 hover:text-yellow-300 text-2xl font-bold"
            >
              ×
            </motion.button>
          </div>

          {!showQuestion ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <motion.h3 
                className="text-yellow-400 text-4xl mb-6 font-bold"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity
                }}
              >
                DAILY DOUBLE!
              </motion.h3>
              <form onSubmit={handleWagerSubmit} className="space-y-6">
                <div>
                  <label className="block text-yellow-400 text-xl mb-2">Select Player</label>
                  <select
                    value={selectedPlayer || ''}
                    onChange={(e) => {
                      setSelectedPlayer(e.target.value);
                      // Reset wager to empty string when player changes
                      setWager('');
                    }}
                    className="w-full p-3 bg-blue-800 text-yellow-400 border-2 border-yellow-400 rounded-md font-korinna"
                    required
                  >
                    <option value="">Choose a player</option>
                    {players.map(player => (
                      <option key={player.id} value={player.id}>
                        {player.name} (Current Score: ${player.score.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
                {selectedPlayer && (
                  <div>
                    <label className="block text-yellow-400 text-xl mb-2">
                      Enter Wager (Min: $5, Max: ${getMaxWager(selectedPlayer).toLocaleString()})
                    </label>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={wager}
                        onChange={(e) => setWager(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter wager amount"
                        className="w-full p-3 bg-blue-800 text-yellow-400 border-2 border-yellow-400 rounded-md font-korinna"
                        required
                      />
                      <motion.button
                        type="button"
                        onClick={handleTrueDailyDouble}
                        className="jeopardy-button w-full bg-yellow-600 hover:bg-yellow-700 border-yellow-400"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        True Daily Double (${getMaxWager(selectedPlayer).toLocaleString()})
                      </motion.button>
                    </div>
                  </div>
                )}
                <motion.button
                  type="submit"
                  className="jeopardy-button w-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!selectedPlayer || wager === ''}
                >
                  Place Wager
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 text-center"
              >
                <h3 className="text-yellow-400 text-3xl mb-4 font-bold">
                  ${question.value.toLocaleString()}
                </h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="question-text"
                >
                  {question.question}
                </motion.p>
              </motion.div>

              {!showAnswer ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShowAnswer}
                  className="jeopardy-button w-full mb-6"
                >
                  Show Answer
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="answer-text p-6 bg-blue-900 rounded-lg border-2 border-yellow-400"
                  >
                    {question.answer}
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {(question.isDouble ? [players.find(p => p.id === selectedPlayer)] : players)
                      .filter((p): p is Player => p !== undefined)
                      .map((player, index) => (
                        <motion.button
                          key={player.id}
                          initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          onClick={() => handlePlayerAnswer(player.id)}
                          className="jeopardy-button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Correct: {player.name}
                        </motion.button>
                    ))}
                    <motion.button
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      onClick={() => handlePlayerAnswer(null)}
                      className="jeopardy-button col-span-2 bg-red-600 hover:bg-red-700 border-red-400"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Nobody Correct
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}