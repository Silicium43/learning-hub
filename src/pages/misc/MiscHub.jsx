import React from 'react';
import { Link } from 'react-router-dom';

export default function MiscHub() {
  return (
    <div className="hub-container p-6 animate-fade-in flex flex-col items-center min-h-screen" style={{ background: '#121212', color: '#fff' }}>
      <div className="w-full max-w-2xl text-center mb-10 pt-10">
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-md" style={{ color: '#68d391', fontFamily: 'Outfit, sans-serif' }}>
          Projets & Divers 🧩
        </h1>
        <p className="text-lg opacity-80 mx-auto max-w-xl text-slate-300">
          Explorez les autres applications, jeux d'apprentissage et outils interactifs centralisés ici.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Link to="/misc/geography" className="hover:scale-105 transition-transform text-center p-8 flex flex-col items-center justify-center border-l-4 relative overflow-hidden group rounded-2xl" style={{ borderColor: '#68d391', background: '#1e1e1e', textDecoration: 'none', color: 'inherit', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          <div className="text-5xl mb-4 relative z-10">🗺️</div>
          <h2 className="text-2xl font-bold mb-2 relative z-10">Géographie Française</h2>
          <p className="text-sm opacity-70 relative z-10">Apprenez les 101 départements français d'Outre-Mer aux régions métropolitaines.</p>
        </Link>
        <a href="https://silicium43.github.io/recettes/" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform text-center p-8 flex flex-col items-center justify-center border-l-4 relative overflow-hidden group rounded-2xl" style={{ borderColor: '#f6ad55', background: '#1e1e1e', textDecoration: 'none', color: 'inherit', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          <div className="text-5xl mb-4 relative z-10">🍝</div>
          <h2 className="text-2xl font-bold mb-2 relative z-10">Nonna App</h2>
          <p className="text-sm opacity-70 relative z-10">Le gestionnaire de Recettes et de Liste de Courses interactif.</p>
        </a>
        <a href="https://silicium43.github.io/biblio/" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform text-center p-8 flex flex-col items-center justify-center md:col-span-2 border-l-4 relative overflow-hidden group rounded-2xl" style={{ borderColor: '#4fd1c5', background: '#1e1e1e', textDecoration: 'none', color: 'inherit', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          <div className="text-5xl mb-4 relative z-10">🏛️</div>
          <h2 className="text-2xl font-bold mb-2 relative z-10">La Bibliothèque</h2>
          <p className="text-sm opacity-70 relative z-10">Application de collection littéraire et de gestion de lectures.</p>
        </a>
      </div>

      <Link to="/" style={{ position: 'fixed', top: '1.5rem', left: '1rem', padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: '16px', fontSize: '0.9rem', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', textDecoration: 'none', color: '#fff', zIndex: 50, transition: 'background 0.2s, transform 0.2s', border: '1px solid rgba(255,255,255,0.1)' }} onMouseOver={e => {e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.transform='scale(1.05)'}} onMouseOut={e => {e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.transform='scale(1)'}}>
        🏠 Accueil
      </Link>
    </div>
  );
}
