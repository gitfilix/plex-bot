import React, { useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
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
    setInput('')
    setLoading(true)

    try {
      const assistantMessage = await fetchAssistantReply([...messages, userMessage])
      setMessages(prev => [...prev, assistantMessage])
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
        messages: chatHistory.map(m => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      throw new Error('API error');
    }

    const data = await response.json();

    return {
      role: 'assistant',
      content: data.choices?.[0]?.message?.content || 'No response',
    };
  };

  return (
    <div className="chat-app">
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
