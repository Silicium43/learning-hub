import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, ChevronDown, ChevronUp, Book, Shapes } from 'lucide-react';
import kanjiDict from '../data/kanjiDict.json';
import radicalDict from '../data/radicalDict.json';
import './Games.css';

// Prepare Kanji Data
const wkKanjis = Object.entries(kanjiDict)
  .filter(([k, data]) => data.wk_level)
  .map(([k, data]) => ({ k, ...data }))
  .sort((a, b) => a.wk_level - b.wk_level);

const kanjiLevels = [...new Set(wkKanjis.map(k => k.wk_level))].sort((a, b) => a - b);

// Prepare Radical Data
const wkRadicals = Object.values(radicalDict).sort((a, b) => a.level - b.level);
const radicalLevels = [...new Set(wkRadicals.map(r => r.level))].sort((a, b) => a - b);

function KanjiLexicon() {
  const [activeTab, setActiveTab] = useState('kanjis'); // 'kanjis' or 'radicals'
  const [search, setSearch] = useState('');
  const [expandedLevels, setExpandedLevels] = useState([1]);
  const [selectedKanji, setSelectedKanji] = useState(null);
  const [selectedRadical, setSelectedRadical] = useState(null);

  const toggleLevel = (level) => {
    setExpandedLevels(prev => 
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  // --- KANJI FILTERING ---
  const filteredKanjis = useMemo(() => {
    if (!search) return wkKanjis;
    const lower = search.toLowerCase();
    return wkKanjis.filter(kanji => 
      kanji.k.includes(lower) || 
      (kanji.wk_meanings && kanji.wk_meanings.some(m => m.toLowerCase().includes(lower))) ||
      (kanji.wk_readings_on && kanji.wk_readings_on.some(r => r.includes(lower))) ||
      (kanji.wk_readings_kun && kanji.wk_readings_kun.some(r => r.replace('!','').includes(lower))) ||
      (kanji.wk_radicals && kanji.wk_radicals.some(r => r.toLowerCase().includes(lower)))
    );
  }, [search]);

  const groupedKanjis = useMemo(() => {
    return filteredKanjis.reduce((acc, kanji) => {
      if (!acc[kanji.wk_level]) acc[kanji.wk_level] = [];
      acc[kanji.wk_level].push(kanji);
      return acc;
    }, {});
  }, [filteredKanjis]);

  // --- RADICAL FILTERING ---
  const filteredRadicals = useMemo(() => {
    if (!search) return wkRadicals;
    const lower = search.toLowerCase();
    return wkRadicals.filter(rad => 
      rad.name.toLowerCase().includes(lower) || 
      (rad.kanjis && rad.kanjis.some(k => k.includes(lower)))
    );
  }, [search]);

  const groupedRadicals = useMemo(() => {
    return filteredRadicals.reduce((acc, rad) => {
      if (!acc[rad.level]) acc[rad.level] = [];
      acc[rad.level].push(rad);
      return acc;
    }, {});
  }, [filteredRadicals]);

  return (
    <div className="game-container animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <Link to="/jp" className="back-link"><ArrowLeft size={16} /> Hub Japonais</Link>
      
      <div className="game-card">
        <h2 className="game-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1rem' }}>
          <Book size={28} /> Lexique WaniKani
        </h2>
        
        {/* TAB NAVIGATION */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => { setActiveTab('kanjis'); setExpandedLevels([1]); setSearch(''); }}
            style={{ 
              padding: '10px 24px', 
              borderRadius: '24px', 
              border: '2px solid',
              borderColor: activeTab === 'kanjis' ? 'var(--accent-color)' : 'var(--border-color)',
              background: activeTab === 'kanjis' ? 'rgba(212, 175, 55, 0.1)' : 'var(--bg-color)',
              color: activeTab === 'kanjis' ? 'var(--accent-color)' : 'var(--text-secondary)',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'all 0.2s'
            }}>
            <Book size={18} /> Kanjis
          </button>
          <button 
            onClick={() => { setActiveTab('radicals'); setExpandedLevels([1]); setSearch(''); }}
            style={{ 
              padding: '10px 24px', 
              borderRadius: '24px', 
              border: '2px solid',
              borderColor: activeTab === 'radicals' ? 'var(--accent-color)' : 'var(--border-color)',
              background: activeTab === 'radicals' ? 'rgba(212, 175, 55, 0.1)' : 'var(--bg-color)',
              color: activeTab === 'radicals' ? 'var(--accent-color)' : 'var(--text-secondary)',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'all 0.2s'
            }}>
            <Shapes size={18} /> Radicaux
          </button>
        </div>

        <div className="config-panel" style={{ marginBottom: '2rem' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder={activeTab === 'kanjis' ? "Rechercher un Kanji, sens ou composant..." : "Rechercher un Radical (nom anglais) ou kanji inclus..."} 
              value={search}
              onChange={(e) => { 
                setSearch(e.target.value); 
                if(e.target.value) setExpandedLevels(activeTab === 'kanjis' ? kanjiLevels : radicalLevels); 
              }}
              style={{
                width: '100%',
                padding: '14px 14px 14px 40px',
                borderRadius: '8px',
                background: 'var(--bg-color)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent-color)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>
        </div>

        <div className="lexicon-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* ----- KANJIS RENDER ----- */}
          {activeTab === 'kanjis' && Object.entries(groupedKanjis).map(([levelStr, kanjisList]) => {
            const level = parseInt(levelStr);
            const isExpanded = expandedLevels.includes(level);
            return (
              <div key={level} className="level-group" style={{ background: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <button 
                  onClick={() => toggleLevel(level)}
                  style={{ width: '100%', padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}
                >
                  <span>Niveau {level} <span style={{fontSize:'0.9rem', color:'var(--text-secondary)', fontWeight:'normal', marginLeft:'10px'}}>({kanjisList.length} kanjis)</span></span>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                
                {isExpanded && (
                  <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '10px' }}>
                    {kanjisList.map(kanji => (
                      <button 
                        key={kanji.k} 
                        onClick={() => setSelectedKanji(kanji)}
                        style={{
                          aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem',
                          background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '8px',
                          color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent-color)'; e.currentTarget.style.color = 'var(--accent-color)'; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                      >
                        {kanji.k}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          {activeTab === 'kanjis' && Object.keys(groupedKanjis).length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>Aucun kanji ne correspond à votre recherche.</p>
          )}

          {/* ----- RADICALS RENDER ----- */}
          {activeTab === 'radicals' && Object.entries(groupedRadicals).map(([levelStr, radList]) => {
            const level = parseInt(levelStr);
            const isExpanded = expandedLevels.includes(level);
            return (
              <div key={level} className="level-group" style={{ background: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <button 
                  onClick={() => toggleLevel(level)}
                  style={{ width: '100%', padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}
                >
                  <span>Niveau {level} <span style={{fontSize:'0.9rem', color:'var(--text-secondary)', fontWeight:'normal', marginLeft:'10px'}}>({radList.length} radicaux)</span></span>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                
                {isExpanded && (
                  <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                    {radList.map(rad => (
                      <button 
                        key={rad.name} 
                        onClick={() => setSelectedRadical(rad)}
                        style={{
                          aspectRatio: '2/1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                          background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '8px',
                          color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s', padding: '10px'
                        }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.color = '#3b82f6'; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                      >
                        <span style={{ fontSize: '1rem', fontWeight: 'bold', textTransform: 'capitalize' }}>{rad.name}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{rad.kanjis.length} kanjis</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          {activeTab === 'radicals' && Object.keys(groupedRadicals).length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>Aucun radical ne correspond à votre recherche.</p>
          )}

        </div>
      </div>

      {/* KANJI MODAL */}
      {selectedKanji && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem', backdropFilter: 'blur(5px)' }} onClick={() => setSelectedKanji(null)}>
          <div style={{ background: 'var(--surface-color)', padding: '2.5rem', borderRadius: '24px', maxWidth: '450px', width: '100%', position: 'relative', border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedKanji(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', cursor: 'pointer', transition: 'all 0.2s' }}>&times;</button>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '6rem', color: 'var(--accent-color)', lineHeight: '1', marginBottom: '1rem', fontWeight: '900', fontFamily: 'Noto Sans JP' }}>{selectedKanji.k}</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {selectedKanji.wk_meanings && selectedKanji.wk_meanings.map((m, i) => (
                  <span key={i} style={{ background: 'var(--bg-color)', padding: '6px 14px', borderRadius: '6px', fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 'bold', border: '1px solid var(--border-color)' }}>{m}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '1px' }}>On'yomi (Chinois)</div>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontFamily: 'Noto Sans JP' }}>
                  {selectedKanji.wk_readings_on && selectedKanji.wk_readings_on.length > 0 ? selectedKanji.wk_readings_on.join(', ') : '-'}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '1px' }}>Kun'yomi (Japonais)</div>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontFamily: 'Noto Sans JP' }}>
                  {selectedKanji.wk_readings_kun && selectedKanji.wk_readings_kun.length > 0 ? selectedKanji.wk_readings_kun.map(k => k.replace('!', '')).join(', ') : '-'}
                </div>
              </div>

              <div style={{ background: 'rgba(212, 175, 55, 0.05)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--accent-color)', marginBottom: '8px', letterSpacing: '1px', fontWeight: 'bold' }}>Radicaux WaniKani</div>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                  {selectedKanji.wk_radicals && selectedKanji.wk_radicals.length > 0 ? selectedKanji.wk_radicals.join(' + ') : 'Aucun'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RADICAL MODAL */}
      {selectedRadical && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem', backdropFilter: 'blur(5px)' }} onClick={() => setSelectedRadical(null)}>
          <div style={{ background: 'var(--surface-color)', padding: '2.5rem', borderRadius: '24px', maxWidth: '500px', width: '100%', position: 'relative', border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedRadical(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', cursor: 'pointer', transition: 'all 0.2s' }}>&times;</button>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>Radical Niveau {selectedRadical.level}</div>
              <div style={{ fontSize: '3rem', color: '#3b82f6', lineHeight: '1', marginBottom: '1rem', fontWeight: '900', textTransform: 'capitalize' }}>{selectedRadical.name}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1rem', letterSpacing: '1px' }}>Kanjis composés de ce radical ({selectedRadical.kanjis.length})</div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))', gap: '8px', maxHeight: '40vh', overflowY: 'auto' }}>
                {selectedRadical.kanjis.map(kanjiChar => (
                   <button 
                      key={kanjiChar}
                      onClick={() => {
                        const kanjiData = wkKanjis.find(k => k.k === kanjiChar);
                        if(kanjiData) {
                          setSelectedRadical(null);
                          setSelectedKanji(kanjiData);
                        }
                      }}
                      style={{
                        aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                        background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px',
                        color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'Noto Sans JP'
                      }}
                   >
                     {kanjiChar}
                   </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default KanjiLexicon;
