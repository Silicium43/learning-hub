import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';

// Main Hub
import Hub from './pages/Hub';

// Japanese Modules
import Home from './pages/Home';
import Conjugation from './pages/Conjugation';
import Review from './pages/Review';
import Lesson from './pages/Lesson';
import Quiz from './pages/Quiz';
import Stats from './pages/Stats';

// French Modules
import FrenchHub from './pages/fr/FrenchHub';
import FrenchConjugation from './pages/fr/FrenchConjugation';
import FrenchVocab from './pages/fr/FrenchVocab';
import FrenchGeography from './pages/fr/FrenchGeography';

// Spanish Modules
import SpanishHub from './pages/es/SpanishHub';
import SpanishConjugation from './pages/es/SpanishConjugation';

// Portuguese Modules
import PortugueseHub from './pages/pt/PortugueseHub';
import PortugueseConjugation from './pages/pt/PortugueseConjugation';

function ThemeSetter() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.startsWith('/fr')) document.body.className = 'theme-fr';
    else if (location.pathname.startsWith('/es')) document.body.className = 'theme-es';
    else if (location.pathname.startsWith('/pt')) document.body.className = 'theme-pt';
    else document.body.className = ''; // Default JS uses '' for Dark Zen
  }, [location]);
  return null;
}

function GlobalHeader() {
  const location = useLocation();
  // Hide global header on the hub, french, spanish, and portuguese pages
  if (location.pathname === '/' || location.pathname.startsWith('/fr') || location.pathname.startsWith('/es') || location.pathname.startsWith('/pt')) {
    return null;
  }
  return (
    <header className="app-header">
      <h1>Learning Hub</h1>
    </header>
  );
}

function App() {
  return (
    <Router>
      <ThemeSetter />
      <div className="app-container">
        <GlobalHeader />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Hub />} />
            
            {/* Japanese */}
            <Route path="/jp" element={<Home />} />
            <Route path="/jp/conjugation" element={<Conjugation />} />
            <Route path="/jp/review" element={<Review />} />
            <Route path="/jp/lesson" element={<Lesson />} />
            <Route path="/jp/quiz" element={<Quiz />} />
            <Route path="/jp/stats" element={<Stats />} />
            
            {/* French */}
            <Route path="/fr" element={<FrenchHub />} />
            <Route path="/fr/conjugation" element={<FrenchConjugation />} />
            <Route path="/fr/vocab" element={<FrenchVocab />} />
            <Route path="/fr/geography" element={<FrenchGeography />} />

            {/* Spanish */}
            <Route path="/es" element={<SpanishHub />} />
            <Route path="/es/conjugation" element={<SpanishConjugation />} />

            {/* Portuguese */}
            <Route path="/pt" element={<PortugueseHub />} />
            <Route path="/pt/conjugation" element={<PortugueseConjugation />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
