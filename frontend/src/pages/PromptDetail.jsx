import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Hash, Calendar, FileText, Zap, AlertCircle } from 'lucide-react';
import { getPromptById } from '../services/api';

const getComplexityClass = (complexity) => {
  if (complexity <= 3) return 'badge-low';
  if (complexity <= 6) return 'badge-medium';
  return 'badge-high';
};

function PromptDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrompt();
  }, [id]);

  const fetchPrompt = async () => {
    try {
      setLoading(true);
      const result = await getPromptById(id);
      setPrompt(result.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Prompt not found.');
      } else {
        setError('Failed to load prompt. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading prompt...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <AlertCircle size={40} strokeWidth={1.5} className="error-icon" />
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/prompts')} className="btn-back">
          <ArrowLeft size={16} strokeWidth={2} />
          Back to List
        </button>
      </div>
    );
  }

  const formattedDate = new Date(prompt.created_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="page-container">
      <button onClick={() => navigate('/prompts')} className="btn-back">
        <ArrowLeft size={16} strokeWidth={2} />
        Back to List
      </button>

      <div className="detail-card">
        {/* Header */}
        <div className="detail-header">
          <h1 className="detail-title">{prompt.title}</h1>
          <span className={`badge ${getComplexityClass(prompt.complexity)}`}>
            <Zap size={12} strokeWidth={2.5} />
            Complexity {prompt.complexity}/10
          </span>
        </div>

        {/* View Count — Redis live counter */}
        <div className="view-count-box">
          <Eye size={20} strokeWidth={1.8} className="view-icon" />
          <span className="view-number">{prompt.view_count}</span>
          <span className="view-label">
            {prompt.view_count === 1 ? 'view' : 'views'}
          </span>
          <span className="view-note">live — updates every visit</span>
        </div>

        {/* Content */}
        <div className="detail-content">
          <h3>
            <FileText size={15} strokeWidth={2} />
            Prompt Content
          </h3>
          <div className="content-box">
            <p>{prompt.content}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="detail-meta">
          <span>
            <Hash size={13} strokeWidth={2} />
            ID: {prompt.id}
          </span>
          <span>
            <Calendar size={13} strokeWidth={1.8} />
            {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PromptDetail;
