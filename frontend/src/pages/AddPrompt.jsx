import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { createPrompt } from '../services/api';

function AddPrompt() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    complexity: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.trim().length < 20) {
      newErrors.content = 'Content must be at least 20 characters';
    }
    const comp = Number(formData.complexity);
    if (!formData.complexity) {
      newErrors.complexity = 'Complexity is required';
    } else if (isNaN(comp) || comp < 1 || comp > 10) {
      newErrors.complexity = 'Complexity must be between 1 and 10';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setSubmitting(true);
      await createPrompt({
        title: formData.title.trim(),
        content: formData.content.trim(),
        complexity: Number(formData.complexity),
      });
      setSuccessMsg('Prompt created successfully!');
      setFormData({ title: '', content: '', complexity: '' });
      setErrors({});
      setTimeout(() => navigate('/prompts'), 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: 'Failed to create prompt. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const comp = Number(formData.complexity);
  const complexityLevel =
    formData.complexity && !isNaN(comp)
      ? comp <= 3 ? { label: 'Low complexity', cls: 'low' }
      : comp <= 6 ? { label: 'Medium complexity', cls: 'medium' }
      : { label: 'High complexity', cls: 'high' }
      : null;

  return (
    <div className="page-container">
      <div className="form-container">
        <div className="form-header">
          <h1>Add New Prompt</h1>
          <p>Save your AI image generation prompt to the library</p>
        </div>

        {successMsg && (
          <div className="success-message">
            <CheckCircle size={16} strokeWidth={2} />
            {successMsg}
          </div>
        )}
        {errors.general && (
          <div className="error-banner">
            <AlertCircle size={16} strokeWidth={2} />
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Cyberpunk City at Night"
              className={errors.title ? 'input-error' : ''}
              maxLength={255}
            />
            {errors.title && (
              <span className="error-text">
                <AlertCircle size={13} strokeWidth={2} />
                {errors.title}
              </span>
            )}
            <span className="char-count">{formData.title.length} / 255</span>
          </div>

          {/* Content */}
          <div className="form-group">
            <label htmlFor="content">
              Content <span className="required">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Describe your AI image prompt in detail..."
              rows={6}
              className={errors.content ? 'input-error' : ''}
            />
            {errors.content && (
              <span className="error-text">
                <AlertCircle size={13} strokeWidth={2} />
                {errors.content}
              </span>
            )}
            <span className="char-count">{formData.content.length} chars (min 20)</span>
          </div>

          {/* Complexity */}
          <div className="form-group">
            <label htmlFor="complexity">
              Complexity (1–10) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="complexity"
              name="complexity"
              value={formData.complexity}
              onChange={handleChange}
              placeholder="Enter 1 to 10"
              min={1}
              max={10}
              className={errors.complexity ? 'input-error' : ''}
            />
            {errors.complexity && (
              <span className="error-text">
                <AlertCircle size={13} strokeWidth={2} />
                {errors.complexity}
              </span>
            )}
            {complexityLevel && (
              <span className={`complexity-preview ${complexityLevel.cls}`}>
                <Zap size={13} strokeWidth={2.5} />
                {complexityLevel.label}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/prompts')}
              className="btn-cancel"
            >
              <ArrowLeft size={15} strokeWidth={2} />
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              <Save size={15} strokeWidth={2} />
              {submitting ? 'Saving...' : 'Save Prompt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPrompt;
