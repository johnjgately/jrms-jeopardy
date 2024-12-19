import React from 'react';

interface SetupScreenProps {
  onCreateClick: () => void;
  onPlayClick: () => void;
}

export default function SetupScreen({ onCreateClick, onPlayClick }: SetupScreenProps) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto space-y-4">
        <button
          onClick={onCreateClick}
          className="w-full py-3 bg-blue-600 text-white rounded-lg"
        >
          Create New Questions
        </button>
        <button
          onClick={onPlayClick}
          className="w-full py-3 bg-green-600 text-white rounded-lg"
        >
          Play with Existing Questions
        </button>
      </div>
    </div>
  );
}