import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { Player } from '../types/game';

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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Player Setup</h2>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Players
        </label>
        <select
          className="w-full p-2 border rounded-md"
          value={numPlayers}
          onChange={(e) => setNumPlayers(Number(e.target.value))}
        >
          {[1, 2, 3].map((num) => (
            <option key={num} value={num}>
              {num} Player{num > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>

      {players.length < numPlayers && (
        <form onSubmit={handleAddPlayer} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Player {players.length + 1} Name
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
              className="flex-1 p-2 border rounded-md"
              placeholder="Enter player name"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </form>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Added Players:</h3>
        <ul className="space-y-2">
          {players.map((player) => (
            <li
              key={player.id}
              className="p-2 bg-gray-50 rounded-md flex justify-between"
            >
              <span>{player.name}</span>
              <span className="text-gray-500">Score: {player.score}</span>
            </li>
          ))}
        </ul>
      </div>

      {players.length === numPlayers && (
        <button
          onClick={handleConfirm}
          className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Start Game
        </button>
      )}
    </div>
  );
}