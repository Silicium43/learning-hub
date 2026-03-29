import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import localforage from 'localforage';
import './Games.css';

function Stats() {
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const data = await localforage.getItem('nhg_quiz_stats') || {};
      // Convert to array and sort by fails descending
      const arr = Object.values(data).sort((a, b) => b.fails - a.fails);
      setStatsData(arr);
      setLoading(false);
    }
    loadStats();
  }, []);

  const handleClear = async () => {
      if(window.confirm("Êtes-vous sûr de vouloir réinitialiser toutes vos statistiques d'erreurs ?")) {
          await localforage.removeItem('nhg_quiz_stats');
          setStatsData([]);
      }
  };

  if (loading) return <div className="game-container"><div className="game-card">Chargement...</div></div>;

  return (
    <div className="game-container">
      <Link to="/jp" className="back-link"><ArrowLeft size={16} /> Accueil</Link>
      
      <div className="game-card" style={{ maxWidth: '800px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 className="game-title" style={{ margin: 0 }}>Statistiques d'Erreurs</h2>
            {statsData.length > 0 && (
                <button onClick={handleClear} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--accent-color)', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trash2 size={16} /> Effacer
                </button>
            )}
        </div>
        
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>
            Voici les Kanjis sur lesquels vous avez fait le plus d'erreurs lors de vos Quiz Libres. Une excellente liste à réviser !
        </p>

        {statsData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--success-color)' }}>
                <h3 style={{ margin: 0 }}>Parfait ! ✨</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Vous n'avez pas enregistré d'erreurs pour le moment.</p>
            </div>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {statsData.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-color-light)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '3rem', color: 'var(--text-primary)', width: '80px', textAlign: 'center', fontWeight: 'bold' }}>
                            {item.k}
                        </div>
                        <div style={{ flex: 1, paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
                            <div style={{ color: 'var(--highlight-color)', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px' }}>Niveau WK {item.level}</div>
                            <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{item.meanings}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>{item.readings}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100px', background: 'var(--bg-color)', padding: '1rem', borderRadius: '8px' }}>
                            <span style={{ fontSize: '2rem', color: 'var(--accent-color)', fontWeight: '900', lineHeight: 1 }}>{item.fails}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Erreurs</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}

export default Stats;
