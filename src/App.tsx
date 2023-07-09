// src/App.tsx
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import './App.css';
import { getAnswer } from './chat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRobot, faPaperPlane  } from '@fortawesome/free-solid-svg-icons';
import CodeBlock from './components/ChatBubble';

export interface Message {
  content: string;
  role: string;
}

interface Thread {
  id: string;
  conversation: Message[];
}


const App: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentThread, setCurrentThread] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo'); // default value

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
    setIsButtonDisabled(e.target.value.trim() === '');
  };
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isShiftEnter = e.nativeEvent instanceof KeyboardEvent && e.nativeEvent.shiftKey && e.nativeEvent.key === 'Enter';
    if (!isShiftEnter) {
      try {
        setIsLoading(true);
        // create list of messages from all threads: Message[]
        const context: Message[] = [];
        threads.forEach((thread) => {

          context.push(...thread.conversation);
        });
        const response = await getAnswer(question, context, selectedModel);

        const newMessage: Message = { content: question, role: 'user' };
        const newAnswer: Message = { content: response?.message?.content || "", role: 'assistant' };

        if (currentThread) {
          setThreads((prevThreads) =>
            prevThreads.map((thread) =>
              thread.id === currentThread
                ? { ...thread, conversation: [...thread.conversation, newMessage, newAnswer] }
                : thread
            )
          );
          setIsLoading(false);
        } else {
          const newThreadId = Date.now().toString();
          const newThread: Thread = {
            id: newThreadId,
            conversation: [newMessage, newAnswer],
          };
          setThreads((prevThreads) => [...prevThreads, newThread]);
          setCurrentThread(newThreadId);
        }

        setAnswer(answer);
        setQuestion('');
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' && !isButtonDisabled) && ((e.key === 'Enter' && !e.shiftKey) || (!e.shiftKey))) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const switchThread = (threadId: string) => {
    setCurrentThread(threadId);
  };
  const Loader: React.FC = () => {
    return <div className="loader"></div>;
  };

  return (
    <div className="app-container">
      <h1>🧑🏽‍💻 My GPT </h1>
      <div className="model-dropdown">
        <label htmlFor="model-select">Model </label>
        <select id="model-select" value={selectedModel} onChange={handleModelChange}>
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5-turbo">GPT-3</option>
        </select>
      </div>
      {currentThread && (
        <div className="conversation">
          
          {threads
            .find((thread) => thread.id === currentThread)
            ?.conversation.map((message, index) => (
              
              <div key={index} className={`message ${message.role}`}>
                {message.role === 'user' ? (
                  <FontAwesomeIcon icon={faUser} />
                ) : (
                  <FontAwesomeIcon icon={faRobot} />
                )}
                <ReactMarkdown remarkPlugins={[gfm]}
                components={{
                  code: ({ node, inline, className, children, style, ...props }) => {
                    
                    return !inline ? (
                      <CodeBlock code={String(children).replace(/\n$/, '')} />
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >{message.content}</ReactMarkdown>
              </div>
            ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <textarea
            className="input-box"
            value={question}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
          />
          <button type="submit" className="submit-button" disabled={isButtonDisabled || isLoading}>
          {isLoading ? <Loader /> : <FontAwesomeIcon icon={faPaperPlane} />}

          </button>
        </div>
      </form>
    </div>
  );
};

export default App;
