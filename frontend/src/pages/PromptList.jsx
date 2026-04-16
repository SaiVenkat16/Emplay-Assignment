import { useState, useEffect } from 'react';
import { Inbox, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { getAllPrompts } from '../services/api';
import PromptCard from '../components/PromptCard';

function PromptList() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAllPrompts();
      setPrompts(result.data || []);
    } catch (err) {
      setError('Failed to load prompts. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading prompts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <AlertCircle size={40} strokeWidth={1.5} className="error-icon" />
        <p className="error-message">{error}</p>
        <button onClick={fetchPrompts} className="btn-retry">
          <RefreshCw size={15} strokeWidth={2} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-row">
          <Layers size={28} strokeWidth={1.8} className="page-icon" />
          <h1>AI Prompt Library</h1>
        </div>
        <p className="subtitle">
          {prompts.length} prompt{prompts.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {prompts.length === 0 ? (
        <div className="empty-state">
          <Inbox size={48} strokeWidth={1.2} className="empty-icon" />
          <p>No prompts yet. Add your first prompt!</p>
        </div>
      ) : (
        <div className="prompt-grid">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PromptList;
