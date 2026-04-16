import { Link, useLocation } from 'react-router-dom';
import { Library, Plus } from 'lucide-react';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/prompts">
          <Library size={20} strokeWidth={2} />
          AI Prompt Library
        </Link>
      </div>
      <div className="navbar-links">
        <Link
          to="/prompts"
          className={location.pathname === '/prompts' ? 'active' : ''}
        >
          All Prompts
        </Link>
        <Link
          to="/add-prompt"
          className={`btn-add-nav ${location.pathname === '/add-prompt' ? 'active' : ''}`}
        >
          <Plus size={16} strokeWidth={2.5} />
          Add Prompt
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
