import React from 'react';

const EntryButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="entry-button">
      Start Chat
    </button>
  );
};

export default EntryButton;