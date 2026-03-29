import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toKana, toHiragana } from 'wanakana';
import { ArrowLeft, Check, X } from 'lucide-react';
import localforage from 'localforage';
import { kanjiDatabase } from '../data/kanjiData';
import { vocabularyDatabase } from '../data/vocabularyData';
import './Games.css';

const db = [
  ...kanjiDatabase.map(k => ({ id: `k_${k.k}`, type: 'kanji', text: k.k, meaning: k.fr, reading: k.on || k.kun, level: k.l })),
  ...vocabularyDatabase.map(v => ({ id: `v_${v.jp}`, type: 'vocabulary', text: v.jp, meaning: v.fr, reading: v.ro, level: v.lvl }))
];

const SRS_INTERVALS = [
  0, 4*3600*1000, 8*3600*1000, 24*3600*1000, 48*3600*1000, 
  7*24*3600*1000, 14*24*3600*1000, 30*24*3600*1000, 120*24*3600*1000
];

function Review() {
  const [srsData, setSrsData] = useState(null);
  const [configMode, setConfigMode] = useState(true); // Show config screen first
  
  // Settings
  const [inputMode, setInputMode] = useState('mcq'); // 'mcq' or 'typing'
  const [studyMode, setStudyMode] = useState('both'); // 'meaning', 'reading', 'both'
  const [sourceMode, setSourceMode] = useState('srs'); // 'srs' or 'errors'

  const [queue, setQueue] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [itemErrors, setItemErrors] = useState({});
  const [mcqOptions, setMcqOptions] = useState([]);

  useEffect(() => {
    async function init() {
      const saved = await localforage.getItem('nhg_srs_data');
      setSrsData(saved || {});
    }
    init();
  }, []);

  const generateMcqOptions = (task) => {
    const isMeaning = task.taskType === 'meaning';
    const target = isMeaning ? task.meaning : toHiragana(task.reading);
    let options = [target];
    
    // Pick 3 random distractors from the same type (kanji/vocab)
    const pool = db.filter(item => item.type === task.type && item.id !== task.id);
    const shuffled = pool.sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < 3 && i < shuffled.length; i++) {
        options.push(isMeaning ? shuffled[i].meaning : toHiragana(shuffled[i].reading));
    }
    setMcqOptions(options.sort(() => 0.5 - Math.random()));
  };

  const startSession = async () => {
    const now = Date.now();
    let available = [];

    if (sourceMode === 'srs') {
        available = db.filter(item => {
            const data = srsData[item.id];
            return data && data.isUnlocked && data.srsLevel < 9 && data.nextReview <= now && data.srsLevel > 0;
        });
    } else {
        const errorLog = await localforage.getItem('nhg_recent_errors') || [];
        available = db.filter(item => errorLog.includes(item.id));
    }

    const newQueue = [];
    available.forEach(item => {
      if (studyMode === 'meaning' || studyMode === 'both') {
          newQueue.push({ ...item, taskType: 'meaning' });
      }
      if (studyMode === 'reading' || studyMode === 'both') {
          newQueue.push({ ...item, taskType: 'reading' });
      }
    });

    newQueue.sort(() => 0.5 - Math.random());
    setQueue(newQueue);
    
    if (newQueue.length > 0) {
        setCurrentTask(newQueue[0]);
        if (inputMode === 'mcq') generateMcqOptions(newQueue[0]);
    }
    
    setConfigMode(false);
  };

  const handleChange = (e) => {
    let val = e.target.value;
    if (currentTask?.taskType === 'reading') {
      val = toKana(val, { IMEMode: true });
    }
    setInputValue(val);
  };

  const processSRSLevelUp = async (itemId, isCorrect) => {
    if(sourceMode === 'errors') return; // Do not affect SRS levels during cram session

    const data = { ...srsData };
    const itemData = data[itemId];
    
    let newLevel = itemData.srsLevel;
    if (isCorrect) {
      newLevel = Math.min(newLevel + 1, 9);
    } else {
      newLevel = Math.max(newLevel - (newLevel >= 5 ? 2 : 1), 1);
    }
    
    itemData.srsLevel = newLevel;
    itemData.nextReview = Date.now() + (SRS_INTERVALS[newLevel] || Infinity);
    setSrsData(data);
    await localforage.setItem('nhg_srs_data', data);
  };

  const submitAnswer = async (userValue) => {
    if (!currentTask || feedback) return;
    
    const val = userValue.trim().toLowerCase();
    
    // Convert target to Hiragana for comparison using toHiragana for absolute safety
    const targetStr = currentTask.taskType === 'meaning' 
        ? currentTask.meaning.toLowerCase() 
        : toHiragana(currentTask.reading).toLowerCase();
    
    const inputStr = currentTask.taskType === 'reading' ? toHiragana(val) : val;

    // Strict but forgiving evaluation
    const isCorrect = targetStr === inputStr || inputStr.includes(targetStr) || targetStr.includes(inputStr);
    
    if (isCorrect) {
      setFeedback({ type: 'success', text: 'Correct ! ✨' });
      setStats(s => ({ ...s, correct: s.correct + 1 }));
      
      // Remove from recent errors if in cram mode
      if (sourceMode === 'errors') {
          let errs = await localforage.getItem('nhg_recent_errors') || [];
          errs = errs.filter(e => e !== currentTask.id);
          await localforage.setItem('nhg_recent_errors', errs);
      }
    } else {
      setFeedback({ type: 'error', text: `Faux : ${currentTask.taskType === 'reading' ? toHiragana(currentTask.reading) : currentTask.meaning}` });
      setStats(s => ({ ...s, incorrect: s.incorrect + 1 }));
      setItemErrors(prev => ({ ...prev, [currentTask.id]: true }));
      
      // Store in recent errors
      let errs = await localforage.getItem('nhg_recent_errors') || [];
      if(!errs.includes(currentTask.id)) {
          errs.push(currentTask.id);
          await localforage.setItem('nhg_recent_errors', errs);
      }
    }

    setTimeout(() => {
      let newQueue = queue.slice(1);
      
      if(!isCorrect && sourceMode === 'srs') {
        newQueue.push(currentTask);
      } else if (isCorrect && sourceMode === 'srs') {
        const remainingTasksForThisItem = newQueue.filter(t => t.id === currentTask.id).length;
        if(remainingTasksForThisItem === 0) {
          const hadError = !!itemErrors[currentTask.id];
          processSRSLevelUp(currentTask.id, !hadError);
        }
      }
      
      setQueue(newQueue);
      if (newQueue.length > 0) {
          setCurrentTask(newQueue[0]);
          if(inputMode === 'mcq') generateMcqOptions(newQueue[0]);
      } else {
          setCurrentTask(null);
      }
      setInputValue('');
      setFeedback(null);
    }, 1500);
  };

  const handleKeyDown = (e) => {
      if(e.key === 'Enter') submitAnswer(inputValue);
  };

  if(!srsData) return <div className="game-container"><div className="game-card">Chargement...</div></div>;

  if (configMode) {
      return (
        <div className="game-container">
            <Link to="/jp" className="back-link"><ArrowLeft size={16} /> Accueil</Link>
            <div className="game-card">
              <h2 className="game-title">Paramètres de Session</h2>
              
              <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)' }}>Type de Saisie</h4>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <button onClick={() => setInputMode('mcq')} style={{ flex: 1, padding: '0.8rem', background: inputMode === 'mcq' ? 'var(--highlight-color)' : 'var(--surface-color)', color: 'white' }}>QCM (Boutons)</button>
                      <button onClick={() => setInputMode('typing')} style={{ flex: 1, padding: '0.8rem', background: inputMode === 'typing' ? 'var(--highlight-color)' : 'var(--surface-color)', color: 'white' }}>Clavier (Typing)</button>
                  </div>
              </div>

              <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)' }}>Ce qu'il faut réviser</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button onClick={() => setStudyMode('both')} style={{ flex: 1, padding: '0.8rem', background: studyMode === 'both' ? 'var(--accent-color)' : 'var(--surface-color)', color: 'white' }}>Mixte (Sens + Lect)</button>
                      <button onClick={() => setStudyMode('meaning')} style={{ flex: 1, padding: '0.8rem', background: studyMode === 'meaning' ? 'var(--accent-color)' : 'var(--surface-color)', color: 'white' }}>Sens</button>
                      <button onClick={() => setStudyMode('reading')} style={{ flex: 1, padding: '0.8rem', background: studyMode === 'reading' ? 'var(--accent-color)' : 'var(--surface-color)', color: 'white' }}>Lecture</button>
                  </div>
              </div>

              <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)' }}>Source des éléments</h4>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <button onClick={() => setSourceMode('srs')} style={{ flex: 1, padding: '0.8rem', background: sourceMode === 'srs' ? 'var(--success-color)' : 'var(--surface-color)', color: 'white' }}>Révisions Dues (SRS)</button>
                      <button onClick={() => setSourceMode('errors')} style={{ flex: 1, padding: '0.8rem', background: sourceMode === 'errors' ? 'var(--success-color)' : 'var(--surface-color)', color: 'white' }}>Corriger mes erreurs</button>
                  </div>
              </div>

              <button onClick={startSession} style={{ width: '100%', padding: '1.2rem', background: 'var(--text-primary)', color: 'var(--bg-color)', fontSize: '1.1rem', fontWeight: 'bold' }}>
                  Lancer la session !
              </button>
            </div>
        </div>
      );
  }

  return (
    <div className="game-container">
      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
          <button onClick={() => setConfigMode(true)} className="back-link" style={{ padding: 0, margin: 0, width: 'auto' }}>
              <X size={16} /> Quitter la session
          </button>
      </div>

      <div className="game-card" style={{ borderColor: currentTask?.taskType === 'reading' ? 'var(--highlight-color)' : 'var(--accent-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span>Restant: <b className="text-light">{queue.length}</b></span>
          {currentTask && <span>Niv. {srsData[currentTask.id]?.srsLevel || '?'}</span>}
        </div>

        {currentTask ? (
          <div className="question-box">
            <div className="word-base" style={{ fontSize: '4rem', margin: '2rem 0' }}>{currentTask.text}</div>
            
            <div className="instruction-badge" style={{ color: currentTask.taskType === 'reading' ? 'var(--highlight-color)' : 'var(--accent-color)', background: 'transparent', border: '1px solid currentColor', fontSize: '1rem' }}>
              {currentTask.taskType === 'reading' ? 'Japonais (Kana)' : 'Traduction (Français)'}
            </div>

            {inputMode === 'typing' ? (
                <input 
                  type="text" 
                  className={`answer-input ${feedback?.type || ''}`}
                  value={inputValue}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder={currentTask.taskType === 'reading' ? 'ex: たべる' : 'ex: Manger'}
                  disabled={!!feedback}
                  autoFocus
                />
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', marginTop: '1rem' }}>
                    {mcqOptions.map((opt, i) => (
                        <button 
                          key={i} 
                          className="opt-btn"
                          disabled={!!feedback}
                          style={{
                              background: feedback && (opt === (currentTask.taskType === 'meaning' ? currentTask.meaning : toHiragana(currentTask.reading))) ? 'var(--success-color)' : 'var(--surface-color-light)',
                              color: 'var(--text-primary)', padding: '1.2rem 1rem', fontSize: '1.1rem', border: '1px solid var(--border-color)', borderRadius: '12px'
                          }}
                          onClick={() => submitAnswer(opt)}>
                          {opt}
                        </button>
                    ))}
                </div>
            )}
            
            <div className="feedback-text" style={{ color: feedback?.type === 'success' ? 'var(--success-color)' : 'var(--accent-color)' }}>
              {feedback?.text || '\u00A0'}
            </div>
          </div>
        ) : (
          <div className="question-box" style={{ padding: '3rem 0' }}>
            <h2 style={{color: 'var(--success-color)'}}>Session terminée !</h2>
            <p className="text-muted" style={{marginBottom:'2rem'}}>Aucune révision requise pour le moment.</p>
            <div className="stats-row" style={{ width: '100%', fontSize: '1.1rem' }}>
              <span>Corrects: <b style={{color: 'var(--success-color)'}}>{stats.correct}</b></span>
              <span>Erreurs: <b style={{color: 'var(--accent-color)'}}>{stats.incorrect}</b></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Review;
