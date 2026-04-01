import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1.5rem', marginBottom: '2rem' }}>
          ← Retour aux Langues
      </Link>
      <h2 className="title">Apprentissage Détaillé</h2>
      <div className="menu-grid">
        <Link to="/jp/lesson" className="menu-card">
          <div className="card-icon">学</div>
          <h3>Leçons Nouvelles</h3>
          <p>Découvrez de nouveaux mots et Kanjis.</p>
        </Link>
        <Link to="/jp/conjugation" className="menu-card">
          <div className="card-icon">語</div>
          <h3>Conjugaison</h3>
          <p>Pratiquez les formes verbales et la grammaire.</p>
        </Link>
        <Link to="/jp/review" className="menu-card">
          <div className="card-icon">漢</div>
          <h3>Révisions (SRS)</h3>
          <p>Mémorisation (Typing ou QCM).</p>
        </Link>
        <Link to="/jp/quiz" className="menu-card">
          <div className="card-icon">遊</div>
          <h3>Quiz Libre</h3>
          <p>Testez vos Kanjis par niveau WaniKani.</p>
        </Link>
        <Link to="/stats" className="menu-card">
          <div className="card-icon">📊</div>
          <h3>Statistiques</h3>
          <p>Analysez vos erreurs les plus fréquentes.</p>
        </Link>
        <Link to="/jp/lexicon" className="menu-card">
          <div className="card-icon">辞</div>
          <h3>Lexique</h3>
          <p>Dictionnaire des Kanjis par radicaux.</p>
        </Link>
      </div>

      <div className="srs-guide" style={{ marginTop: '3rem', maxWidth: '800px', width: '100%', background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        <h3 style={{ color: 'var(--highlight-color)', marginTop: 0 }}>Comment fonctionne le SRS ?</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
          Le système de répétition espacée (SRS) planifie vos révisions intelligemment. Plus vous répondez juste, plus l'intervalle avant la prochaine révision s'allonge.
          Une erreur fait reculer l'élément d'un stade (ou deux s'il était avancé). Les éléments nécessitent de valider à la fois le Sens et la Lecture pour passer au stade suivant !
        </p>
        <ul style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', paddingLeft: '1.5rem', marginBottom: 0 }}>
            <li><strong style={{color:'var(--accent-color)'}}>Apprenti :</strong> 4 heures ➔ 8 heures ➔ 1 jour ➔ 2 jours</li>
            <li><strong style={{color:'var(--highlight-color)'}}>Gourou :</strong> 1 semaine ➔ 2 semaines</li>
            <li><strong style={{color:'#f59e0b'}}>Maître :</strong> 1 mois</li>
            <li><strong style={{color:'var(--success-color)'}}>Éveillé :</strong> 4 mois</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
