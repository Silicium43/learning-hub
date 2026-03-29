import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toKana } from 'wanakana';
import { conjugationDatabase } from '../data/conjugationData';
import './Games.css';
import { ArrowLeft } from 'lucide-react';

function Conjugation() {
  const [filters, setFilters] = useState({
    polite: { plain: true, polite: true },
    tense: { present: true, past: true },
    polarity: { affirmative: true, negative: true },
    kind: { verb: true, 'adj-i': true }
  });

  const [currentQ, setCurrentQ] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState({ score: 0, streak: 0 });
  const [errors, setErrors] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nhg_conj_errors');
    if (saved) setErrors(JSON.parse(saved));
    generateQuestion(filters);
  }, []);

  const generateQuestion = useCallback((currentFilters) => {
    setInputValue('');
    setFeedback(null);
    setIsAnimating(false);

    const matchPool = conjugationDatabase.filter(item => 
      currentFilters.polite[item.polite] &&
      currentFilters.tense[item.tense] &&
      currentFilters.polarity[item.polarity] &&
      currentFilters.kind[item.type]
    );

    if (matchPool.length === 0) {
      setCurrentQ(null);
      return;
    }
    const q = matchPool[Math.floor(Math.random() * matchPool.length)];
    setCurrentQ(q);
  }, []);

  const handleFilterChange = (category, key) => {
    const newFilters = {
      ...filters,
      [category]: { ...filters[category], [key]: !filters[category][key] }
    };
    setFilters(newFilters);
    generateQuestion(newFilters);
  };

  const handleChange = (e) => {
    const text = e.target.value;
    setInputValue(toKana(text, { IMEMode: true }));
  };

  const handleSubmit = (e) => {
    if (e.key === 'Enter' && currentQ && !isAnimating) {
      const val = inputValue.trim();
      if (!val) return;
      
      setIsAnimating(true);
      
      if (val === currentQ.ans) {
        setStats(s => ({ score: s.score + 1, streak: s.streak + 1 }));
        setFeedback({ type: 'success', text: '正解 ! Correct ✨' });
        setTimeout(() => generateQuestion(filters), 800);
      } else {
        setStats(s => ({ ...s, streak: 0 }));
        setFeedback({ type: 'error', text: `Faux : ${currentQ.ans}` });
        
        const errKey = `${currentQ.base}_${currentQ.polite}_${currentQ.tense}_${currentQ.polarity}`;
        setErrors(prev => {
          const next = { ...prev };
          if (!next[errKey]) {
            next[errKey] = {
              count: 0,
              base: currentQ.base,
              ans: currentQ.ans,
              form: `${currentQ.polite.substring(0,2)}.${currentQ.tense.substring(0,2)}`
            };
          }
          next[errKey].count++;
          localStorage.setItem('nhg_conj_errors', JSON.stringify(next));
          return next;
        });
        
        setTimeout(() => setInputValue(''), 1500);
        setTimeout(() => setIsAnimating(false), 1500); // Allow retry after 1.5s
      }
    }
  };

  const errorList = Object.entries(errors)
    .map(([key, data]) => ({ key, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="game-container">
      <Link to="/jp" className="back-link"><ArrowLeft size={16} /> Accueil</Link>
      
      <div className="game-card">
        <h2 className="game-title">Conjugaison</h2>
        
        <div className="config-panel">
            <div className="config-group">
                <label>Politesse</label>
                <span><input type="checkbox" checked={filters.polite.plain} onChange={() => handleFilterChange('polite', 'plain')} /> Casual</span>
                <span><input type="checkbox" checked={filters.polite.polite} onChange={() => handleFilterChange('polite', 'polite')} /> Poli (Masu)</span>
            </div>
            <div className="config-group">
                <label>Temps</label>
                <span><input type="checkbox" checked={filters.tense.present} onChange={() => handleFilterChange('tense', 'present')} /> Présent</span>
                <span><input type="checkbox" checked={filters.tense.past} onChange={() => handleFilterChange('tense', 'past')} /> Passé</span>
            </div>
            <div className="config-group">
                <label>Polarité</label>
                <span><input type="checkbox" checked={filters.polarity.affirmative} onChange={() => handleFilterChange('polarity', 'affirmative')} /> (+) Affirm.</span>
                <span><input type="checkbox" checked={filters.polarity.negative} onChange={() => handleFilterChange('polarity', 'negative')} /> (-) Négat.</span>
            </div>
            <div className="config-group">
                <label>Type</label>
                <span><input type="checkbox" checked={filters.kind.verb} onChange={() => handleFilterChange('kind', 'verb')} /> Verbes</span>
                <span><input type="checkbox" checked={filters.kind['adj-i']} onChange={() => handleFilterChange('kind', 'adj-i')} /> Adj-i</span>
            </div>
        </div>

        {currentQ ? (
          <div className="question-box">
            <div className="word-base">{currentQ.base}</div>
            <div className="word-meaning">{currentQ.meaning}</div>
            
            <div className="instruction-badge">
              {currentQ.polite === 'plain' ? 'CASUAL' : 'POLI'} |&nbsp;
              {currentQ.tense === 'present' ? 'PRÉSENT' : 'PASSÉ'} |&nbsp;
              {currentQ.polarity === 'affirmative' ? '(+)' : '(-)'}
            </div>

            <input 
              type="text" 
              className={`answer-input ${feedback?.type || ''}`}
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleSubmit}
              placeholder="さあ、どうぞ !"
              disabled={isAnimating && feedback?.type === 'success'}
              autoFocus
            />
            
            <div className="feedback-text" style={{ color: feedback?.type === 'success' ? 'var(--success-color)' : 'var(--accent-color)' }}>
              {feedback?.text || '\u00A0'}
            </div>
          </div>
        ) : (
          <div className="question-box">
            <div className="word-base">Ø</div>
            <div className="word-meaning">Ajustez vos filtres</div>
          </div>
        )}

        <div className="stats-row">
            <span>Score: <b className="text-light">{stats.score}</b></span>
            <span>Série: <b className="text-highlight">{stats.streak}</b></span>
        </div>
      </div>

      {errorList.length > 0 && (
        <div className="error-stats-card">
          <div className="stats-header">
              <h3 className="stats-title">⚠️ Top Erreurs</h3>
              <button className="reset-btn" onClick={() => { if(window.confirm('Effacer les stats ?')) { localStorage.removeItem('nhg_conj_errors'); setErrors({}); } }}>Reset</button>
          </div>
          <table className="stats-table">
              <thead>
                  <tr><th>Forme</th><th>Attendu</th><th style={{textAlign: 'right'}}>Échecs</th></tr>
              </thead>
              <tbody>
                  {errorList.map(err => (
                    <tr key={err.key}>
                        <td><b className="text-highlight">{err.base}</b> <span className="text-muted text-xs">{err.form}</span></td>
                        <td><code className="code-badge">{err.ans}</code></td>
                        <td className="text-right text-error font-bold">{err.count}</td>
                    </tr>
                  ))}
              </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Conjugation;
