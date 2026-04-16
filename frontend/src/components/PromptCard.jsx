import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, Zap } from 'lucide-react';

const getComplexityClass = (complexity) => {
  if (complexity <= 3) return 'badge-low';
  if (complexity <= 6) return 'badge-medium';
  return 'badge-high';
};

const getComplexityLabel = (complexity) => {
  if (complexity <= 3) return 'Low';
  if (complexity <= 6) return 'Medium';
  return 'High';
};

function PromptCard({ prompt }) {
  const navigate = useNavigate();

  const formattedDate = new Date(prompt.created_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="prompt-card" onClick={() => navigate(`/prompts/${prompt.id}`)}>
      <div className="card-header">
        <h3 className="card-title">{prompt.title}</h3>
        <span className={`badge ${getComplexityClass(prompt.complexity)}`}>
          <Zap size={11} strokeWidth={2.5} />
          {getComplexityLabel(prompt.complexity)} {prompt.complexity}/10
        </span>
      </div>
      <div className="card-footer">
        <span className="card-date">
          <Calendar size={13} strokeWidth={1.8} />
          {formattedDate}
        </span>
        <span className="card-action">
          View Details
          <ChevronRight size={14} strokeWidth={2} />
        </span>
      </div>
    </div>
  );
}

export default PromptCard;
