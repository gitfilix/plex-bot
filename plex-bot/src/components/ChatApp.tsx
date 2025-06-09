import React, { useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string | React.ReactNode;
};

const ChatApp = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_REACT_PERPLEXITY_API_KEY || 'no key found';

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const assistantMessage = await fetchAssistantReply([...messages, userMessage]);
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, there was an error.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssistantReply = async (chatHistory: Message[]): Promise<Message> => {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: chatHistory.map(m => ({ role: m.role, content: typeof m.content === 'string' ? m.content : '' })),
        response_format: {
          type: 'text'
        }
      }),
    });

    if (!response.ok) {
      throw new Error('API error');
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || 'No response';

    // Format the answer as markdown and render citations and search results
    const citations = data.citations || [];
    const searchResults = data.search_results || [];

    content = (
      <div>
        {/* Render the answer as markdown-like (simple formatting) */}
        <div style={{ marginBottom: '1em', whiteSpace: 'pre-line' }}>{content}</div>
        {/* Render citations if present */}
        {citations.length > 0 && (
          <div style={{ fontSize: '0.95em', marginBottom: '0.5em' }}>
            <strong>Citations:</strong>
            <ul>
              {citations.map((url: string, i: number) => (
                <li key={i}>
                  <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Render search results if present */}
        {searchResults.length > 0 && (
          <div style={{ fontSize: '0.95em' }}>
            <strong>Search Results:</strong>
            <ul>
              {searchResults.map((result: any, i: number) => (
                <li key={i}>
                  <a href={result.url} target="_blank" rel="noopener noreferrer">
                    {result.title || result.url}
                  </a>
                  {result.date && <span style={{ marginLeft: 8, color: '#888' }}>({result.date})</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );

    return {
      role: 'assistant',
      content,
    };
  };

  return (
    <div className="chat-app">
      <div className="chat-header">
        <h2>Chat with the Web</h2>
      </div>
      <div className='chat-menu'>
        <h2>Chat Menu</h2>
        <div className='model-selector'>
         <h3>current Model:</h3>
          <span>Sonar</span>
          <select>
            <optgroup label="Models">
              <option value="sonar">Sonar</option>
              <option value="sonar-pro">Sonar-pro</option>
            </optgroup>
          </select>  
         </div>       
      </div>
      {/* Chat messages area */}
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role}`}
          >
            <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div className="message assistant">Bot is typing...</div>}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        disabled={loading}
        onKeyDown={e => {
          if (e.key === 'Enter') handleSendMessage();
        }}
      />
      <button onClick={handleSendMessage} disabled={loading || !input.trim()}>
        Send
      </button>
    </div>
  );
};

export default ChatApp;
