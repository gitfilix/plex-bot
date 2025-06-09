import './styles/App.css'
import React, { useState } from 'react';
import EntryButton from './components/EntryButton';
import ChatApp from './components/ChatApp';

function App() {
  const [showChat, setShowChat] = useState(false);


  const handleEntryButtonClick = () => {
    setShowChat(true);
  };

  return (
    <>
      <h1>FLX-Plex question Bot</h1>
      {!showChat ? (
        <EntryButton onClick={handleEntryButtonClick} />
      ) : (
        <ChatApp />
      )}
    </>
  );
}

export default App;
