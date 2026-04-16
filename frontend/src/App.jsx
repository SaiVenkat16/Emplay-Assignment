import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PromptList from './pages/PromptList';
import PromptDetail from './pages/PromptDetail';
import AddPrompt from './pages/AddPrompt';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Default → Prompt List page కి redirect */}
          <Route path="/" element={<Navigate to="/prompts" replace />} />
          <Route path="/prompts" element={<PromptList />} />
          <Route path="/prompts/:id" element={<PromptDetail />} />
          <Route path="/add-prompt" element={<AddPrompt />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
