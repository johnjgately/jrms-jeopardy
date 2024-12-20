import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Player } from '../types/game';
import '../styles/jeopardy-theme.css';

interface PlayerSetupProps {
  onPlayersConfirmed: (players: Player[]) => void;
}

export default function PlayerSetup({ onPlayersConfirmed }: PlayerSetupProps) {
  const [numPlayers, setNumPlayers] = useState<number>(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentName, setCurrentName] = useState('');

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentName.trim() && players.length < numPlayers) {
      const newPlayer: Player = {
        id: crypto.randomUUID(),
        name: currentName.trim(),
        score: 0
      };
      setPlayers([...players, newPlayer]);
      setCurrentName('');
    }
  };

  const handleConfirm = () => {
    if (players.length === numPlayers) {
      onPlayersConfirmed(players);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 p-6 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div 
        className="w-full max-w-md bg-blue-900 p-8 rounded-lg border-4 border-yellow-400 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.h2 
          className="game-title text-4xl mb-8 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Player Setup
        </motion.h2>

        <div className="mb-6">
          <label className="block text-yellow-400 text-lg font-korinna mb-2">
            Number of Players
          </label>
          <select
            className="w-full p-3 bg-blue-800 text-yellow-400 border-2 border-yellow-400 rounded-md font-korinna"
            value={numPlayers}
            onChange={(e) => setNumPlayers(Number(e.target.value))}
          >
            {[1, 2, 3].map((num) => (
              <option key={num} value={num} className="bg-blue-800">
                {num} Player{num > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        {players.length < numPlayers && (
          <motion.form 
            onSubmit={handleAddPlayer} 
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <label className="block text-yellow-400 text-lg font-korinna mb-2">
              Player {players.length + 1} Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                className="flex-1 p-3 bg-blue-800 text-white border-2 border-yellow-400 rounded-md font-korinna placeholder-yellow-200/50"
                placeholder="Enter player name"
              />
              <motion.button
                type="submit"
                className="jeopardy-button px-6"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add
              </motion.button>
            </div>
          </motion.form>
        )}

        {players.length > 0 && (
          <div className="mb-6">
            <h3 className="text-yellow-400 text-lg font-korinna mb-2">Players:</h3>
            <motion.ul className="space-y-2">
              {players.map((player, index) => (
                <motion.li
                  key={player.id}
                  className="p-3 bg-blue-800 rounded-md border-2 border-yellow-400 flex justify-between text-white font-korinna"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span>{player.name}</span>
                  <span className="text-yellow-400">${player.score}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        )}

        {players.length === numPlayers && (
          <motion.button
            onClick={handleConfirm}
            className="jeopardy-button w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Game
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}