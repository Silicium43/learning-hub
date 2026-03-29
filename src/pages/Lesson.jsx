import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import localforage from 'localforage';
import { ArrowLeft, ChevronRight, Check } from 'lucide-react';
import { kanjiDatabase } from '../data/kanjiData';
import { vocabularyDatabase } from '../data/vocabularyData';
import './Games.css';

const db = [
  ...kanjiDatabase.map(k => ({ id: `k_${k.k}`, type: 'kanji', text: k.k, meaning: k.fr, reading: k.on || k.kun, level: k.l, group: k.group, radicals: k.radicals, mnemonic: k.mnemonic })),
  ...vocabularyDatabase.map(v => ({ id: `v_${v.jp}`, type: 'vocabulary', text: v.jp, meaning: v.fr, reading: v.ro, level: v.lvl, group: v.group }))
];

function Lesson() {
  const navigate = useNavigate();
  const [srsData, setSrsData] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    async function load() {
      const saved = await localforage.getItem('nhg_srs_data') || {};
      setSrsData(saved);
    }
    load();
  }, []);

  if (!srsData) return <div className="game-container"><div className="game-card">Chargement...</div></div>;

  // Find the lowest group number that still has locked items (srsLevel === 0)
  const lockedItems = db.filter(item => {
      const d = srsData[item.id];
      // If it exists but is level 0, it's locked.
      return d && d.srsLevel === 0;
  });

  // Group items by "group" number
  const groups = {};
  lockedItems.forEach(item => {
      if(!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
  });
  
  const availableGroupNumber = Object.keys(groups).sort((a,b) => Number(a) - Number(b))[0];
  const itemsInLesson = availableGroupNumber ? groups[availableGroupNumber] : [];

  const handleStart = () => {
      if(itemsInLesson.length > 0) {
          setActiveGroup(itemsInLesson);
          setSlideIndex(0);
      }
  };

  const handleNext = async () => {
      if (slideIndex < activeGroup.length - 1) {
          setSlideIndex(slideIndex + 1);
      } else {
          // Finish lesson: unlock all items in activeGroup
          const newData = { ...srsData };
          activeGroup.forEach(item => {
              newData[item.id] = { ...newData[item.id], srsLevel: 1, nextReview: Date.now() + 4*3600*1000, isUnlocked: true };
          });
          await localforage.setItem('nhg_srs_data', newData);
          alert('Leçon terminée ! Ces mots ont été ajoutés à vos révisions (Apprenti 1).');
          navigate('/jp');
      }
  };

  if (activeGroup) {
      const item = activeGroup[slideIndex];
      return (
          <div className="game-container">
            <div className="game-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                <span>Leçon {slideIndex + 1} / {activeGroup.length}</span>
                <span>Groupe {item.group}</span>
              </div>

              <div className="question-box">
                <div className="word-base" style={{ fontSize: '5rem', margin: '0.5rem 0' }}>{item.text}</div>
                <div className="instruction-badge" style={{ background: item.type === 'kanji' ? '#e53935' : '#8b5cf6', color: 'white', border: 'none' }}>
                    {item.type === 'kanji' ? 'Kanji' : 'Vocabulaire'}
                </div>
                
                <div style={{ textAlign: 'left', width: '100%', marginTop: '1rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: '12px' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Sens</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{item.meaning}</div>
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Lecture</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{item.reading}</div>
                    </div>

                    {item.type === 'kanji' && item.radicals && (
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Radicaux</span>
                            <div style={{ fontSize: '1rem' }}>{item.radicals.join(', ')}</div>
                        </div>
                    )}

                    {item.type === 'kanji' && item.mnemonic && (
                        <div>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Mnémotechnique</span>
                            <div style={{ fontSize: '1rem', lineHeight: '1.4', color: 'var(--highlight-color)' }}>{item.mnemonic}</div>
                        </div>
                    )}
                </div>

                <button 
                  onClick={handleNext}
                  style={{ marginTop: '2rem', padding: '1rem 2rem', background: 'var(--success-color)', color: 'white', width: '100%', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {slideIndex < activeGroup.length - 1 ? 'Suivant' : 'Terminer la Leçon'} {slideIndex < activeGroup.length - 1 ? <ChevronRight size={20} /> : <Check size={20} />}
                </button>
              </div>
            </div>
          </div>
      );
  }

  return (
    <div className="game-container">
      <Link to="/jp" className="back-link"><ArrowLeft size={16} /> Accueil</Link>
      <div className="game-card">
        <h2 className="game-title">Apprentissage (Leçons)</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Découvrez de nouveaux Kanjis et mots de Vocabulaire avant de les réviser.
        </p>

        {availableGroupNumber ? (
            <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: 'var(--highlight-color)' }}>Groupe {availableGroupNumber} disponible</h3>
                <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)' }}>Il y a {itemsInLesson.length} éléments à apprendre aujourd'hui.</p>
                <button onClick={handleStart} style={{ padding: '0.8rem 1.5rem', background: 'var(--accent-color)', color: 'white', fontWeight: 'bold' }}>
                    Commencer la leçon
                </button>
            </div>
        ) : (
            <div style={{ textAlign: 'center', color: 'var(--success-color)' }}>
                <Check size={48} style={{ margin: '0 auto 1rem auto' }} />
                <h3>Toutes les leçons sont terminées !</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Attendez vos prochaines révisions pour continuer à progresser.</p>
            </div>
        )}
      </div>
    </div>
  );
}

export default Lesson;
