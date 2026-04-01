import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import localforage from 'localforage';
import { wkKanjiData } from '../data/wkKanjiData';
import kanjiDict from '../data/kanjiDict.json';
import './Games.css';

function Quiz() {
  const [inGame, setInGame] = useState(false);
  const [minLevel, setMinLevel] = useState(1);
  const [maxLevel, setMaxLevel] = useState(60);
  const [studyMode, setStudyMode] = useState('both');
  const [showRadicals, setShowRadicals] = useState(false);

  const [pool, setPool] = useState([]);
  const [currentQ, setCurrentQ] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const startQuiz = () => {
    const validKanjis = wkKanjiData.filter(k => k.level >= minLevel && k.level <= maxLevel);
    if (validKanjis.length < 4) {
      alert("Plage de niveau trop restrictive (moins de 4 kanjis trouvés).");
      return;
    }
    setPool(validKanjis);
    setStats({ correct: 0, total: 0 });
    setStreak(0);
    setInGame(true);
    generateNextQuestion(validKanjis);
  };

  const generateNextQuestion = (currentPool = pool) => {
    setFeedback(null);
    const qTask = currentPool[Math.floor(Math.random() * currentPool.length)];
    const isMeaningTask = studyMode === 'meaning' ? true : (studyMode === 'reading' ? false : Math.random() > 0.5);
    
    let target = isMeaningTask ? qTask.meanings.join(', ') : qTask.readings.join(', ');
    if(!target) {
        // Fallback si pas de lecture
        target = qTask.meanings.join(', ');
    }

    const qType = isMeaningTask ? 'meaning' : 'reading';

    // Disctractors
    const opts = [target];
    const shuf = [...currentPool].sort(() => 0.5 - Math.random());
    for(let i=0; i<3 && i<shuf.length; i++) {
        let opt = isMeaningTask ? shuf[i].meanings.join(', ') : shuf[i].readings.join(', ');
        if(!opt) opt = shuf[i].meanings.join(', ');

        if(opt !== target && !opts.includes(opt)) {
            opts.push(opt);
        } else {
            // Find another if collision (rare)
            const backup = wkKanjiData[Math.floor(Math.random() * wkKanjiData.length)];
            const bOpt = isMeaningTask ? backup.meanings.join(', ') : backup.readings.join(', ');
            opts.push(bOpt || backup.meanings.join(', '));
        }
    }

    setOptions(opts.sort(() => 0.5 - Math.random()));
    setCurrentQ({ ...qTask, type: qType, target });
  };

  const logError = async (q) => {
    try {
      let errStats = await localforage.getItem('nhg_quiz_stats') || {};
      const key = q.k;
      if (!errStats[key]) {
        errStats[key] = { k: q.k, level: q.level, meanings: q.meanings.join(', '), readings: q.readings.join(', '), fails: 0 };
      }
      errStats[key].fails += 1;
      await localforage.setItem('nhg_quiz_stats', errStats);
    } catch(e) {}
  };

  const submitAnswer = (selected) => {
    if (feedback) return;
    
    if (selected === currentQ.target) {
      setFeedback({ type: 'success', text: 'Excellent !', selected });
      setStats(s => ({ correct: s.correct + 1, total: s.total + 1 }));
      setStreak(s => {
          const ns = s + 1;
          if(ns > bestStreak) setBestStreak(ns);
          return ns;
      });
      setTimeout(() => generateNextQuestion(), 800);
    } else {
      setFeedback({ type: 'error', text: `Faux ! C'était : ${currentQ.target}`, selected });
      setStats(s => ({ ...s, total: s.total + 1 }));
      setStreak(0);
      logError(currentQ);
      setTimeout(() => generateNextQuestion(), 2000);
    }
  };

  if(!wkKanjiData || wkKanjiData.length === 0) return <div className="game-container"><div className="game-card">Chargement des données...</div></div>;

  if (!inGame) {
      return (
        <div className="game-container">
            <Link to="/jp" className="back-link"><ArrowLeft size={16} /> Accueil</Link>
            <div className="game-card">
              <h2 className="game-title">Quiz Libre (WaniKani)</h2>
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>
                  Entraînez-vous à l'infini sur les 2000+ Kanjis WaniKani sans affecter votre SRS. Les réponses sont en Anglais (selon la base WK officielle).
              </p>

              <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: 'var(--highlight-color)', textAlign: 'center' }}>Sélectionnez vos niveaux</h4>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Niveau Min</label>
                          <input type="number" min="1" max="60" value={minLevel} onChange={(e) => setMinLevel(Number(e.target.value))} style={{ width: '80px', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'white', textAlign: 'center', fontSize: '1.2rem' }} />
                      </div>
                      <span style={{ color: 'var(--text-secondary)' }}>à</span>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Niveau Max</label>
                          <input type="number" min="1" max="60" value={maxLevel} onChange={(e) => setMaxLevel(Number(e.target.value))} style={{ width: '80px', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'white', textAlign: 'center', fontSize: '1.2rem' }} />
                      </div>
                  </div>
              </div>

              <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', textAlign: 'center' }}>Ce qu'il faut tester</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button onClick={() => setStudyMode('both')} style={{ flex: 1, padding: '0.8rem', background: studyMode === 'both' ? 'var(--highlight-color)' : 'var(--surface-color)', color: 'white' }}>Mixte</button>
                      <button onClick={() => setStudyMode('meaning')} style={{ flex: 1, padding: '0.8rem', background: studyMode === 'meaning' ? 'var(--highlight-color)' : 'var(--surface-color)', color: 'white' }}>Sens</button>
                      <button onClick={() => setStudyMode('reading')} style={{ flex: 1, padding: '0.8rem', background: studyMode === 'reading' ? 'var(--highlight-color)' : 'var(--surface-color)', color: 'white' }}>Lecture</button>
                  </div>
              </div>

              <div style={{ background: 'var(--bg-color)', padding: '1.2rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', border: '1px solid var(--border-color)' }} onClick={() => setShowRadicals(!showRadicals)}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>Afficher les Radicaux (Indice)</span>
                  <input type="checkbox" checked={showRadicals} readOnly style={{ width: '20px', height: '20px', accentColor: 'var(--highlight-color)' }} />
              </div>

              <button onClick={startQuiz} style={{ width: '100%', padding: '1.2rem', background: 'var(--text-primary)', color: 'var(--bg-color)', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '12px' }}>
                  Commencer le Quiz
              </button>
            </div>
        </div>
      );
  }

  return (
    <div className="game-container">
      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
          <button onClick={() => setInGame(false)} className="back-link" style={{ padding: 0, margin: 0, width: 'auto' }}>
              <RefreshCw size={16} /> Changer les Niveaux
          </button>
      </div>

      <div className="game-card" style={{ borderColor: currentQ?.type === 'reading' ? 'var(--highlight-color)' : 'var(--accent-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
              <span>Score: <b className="text-success">{stats.total > 0 ? Math.round((stats.correct/stats.total)*100) : 0}%</b></span>
              <span>🔥 Streak: <b style={{color: streak > 0 ? '#ff9800' : 'inherit'}}>{streak}</b> <span style={{fontSize:'0.7rem', opacity:0.7}}>(Max: {bestStreak})</span></span>
          </div>
          <span>Niveau WK: {currentQ?.level}</span>
        </div>

        {currentQ && (
          <div className="question-box">
            <div className="word-base" style={{ fontSize: '5rem', margin: '1rem 0 0.5rem 0', lineHeight: '1' }}>{currentQ.k}</div>
            
            {showRadicals && kanjiDict[currentQ.k]?.wk_radicals && (
                <div style={{ color: 'var(--text-primary)', fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', background: 'rgba(0,0,0,0.2)', padding: '6px 12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    Indice: <span style={{ color: 'var(--accent-color)' }}>{kanjiDict[currentQ.k].wk_radicals.join(' + ')}</span>
                </div>
            )}

            <div className="instruction-badge" style={{ color: currentQ.type === 'reading' ? 'var(--highlight-color)' : 'var(--accent-color)', background: 'transparent', border: '1px solid currentColor', fontSize: '1rem', marginTop: '0.5rem' }}>
              {currentQ.type === 'reading' ? 'Lecture (Kana)' : 'Sens (Anglais)'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', marginTop: '1rem' }}>
                {options.map((opt, i) => (
                    <button 
                        key={i} 
                        disabled={!!feedback}
                        style={{
                            background: feedback && opt === currentQ.target ? 'var(--success-color)' : (feedback && feedback.type === 'error' && feedback.selected === opt ? 'var(--accent-color)' : 'var(--surface-color-light)'),
                            color: 'var(--text-primary)', padding: '1.5rem 1rem', fontSize: '1.1rem', border: '1px solid var(--border-color)', borderRadius: '12px'
                        }}
                        onClick={() => submitAnswer(opt)}>
                        {opt}
                    </button>
                ))}
            </div>
            
            <div className="feedback-text" style={{ color: feedback?.type === 'success' ? 'var(--success-color)' : 'var(--accent-color)' }}>
              {feedback?.text || '\u00A0'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;
