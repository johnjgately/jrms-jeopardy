import { motion } from 'framer-motion';
import { CustomQuestionSet } from '../../types/game';
import '../../styles/jeopardy-theme.css';

interface QuestionBankListProps {
  questionBanks: CustomQuestionSet[];
  onSelect: (bank: CustomQuestionSet) => void;
}

export default function QuestionBankList({
  questionBanks,
  onSelect,
}: QuestionBankListProps) {
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 p-6 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full max-w-2xl">
        <motion.h2 
          className="game-title text-4xl mb-8 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Select Question Set
        </motion.h2>
        
        <motion.div 
          className="space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {questionBanks.map((bank, index) => (
            <motion.button
              key={bank.id}
              onClick={() => onSelect(bank)}
              className="w-full p-6 bg-blue-900 rounded-lg border-2 border-yellow-400 hover:border-yellow-300 transition-colors text-left shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="font-korinna text-yellow-400 text-2xl mb-2">{bank.name}</div>
              <div className="text-white/80 font-korinna">
                Created: {new Date(bank.dateCreated).toLocaleDateString()}
              </div>
            </motion.button>
          ))}

          {questionBanks.length === 0 && (
            <motion.div
              className="text-center text-yellow-400 font-korinna text-xl p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              No question sets available. Create one first!
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}