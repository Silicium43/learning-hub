import React from 'react';
import { Link } from 'react-router-dom';

export default function FrenchHub() {
  return (
    <div className="hub-container p-6 animate-fade-in flex flex-col items-center min-h-screen">
      <div className="w-full max-w-2xl text-center mb-10 pt-10">
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-md theme-gradient-text" style={{ fontFamily: 'var(--font-main)' }}>
          Académie Française 🇫🇷
        </h1>
        <p className="text-lg opacity-80 mx-auto max-w-xl">
          Le raffinement de la langue. Explorez notre collection d'exercices premium.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Link to="/fr/conjugation" className="card hover:scale-105 transition-transform text-center p-8 flex flex-col items-center justify-center border-l-4 relative overflow-hidden group" style={{ borderColor: 'var(--primary)' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="text-5xl mb-4 relative z-10">✍️</div>
          <h2 className="text-2xl font-bold mb-2 relative z-10">Conjugaison</h2>
          <p className="text-sm opacity-70 relative z-10">Maîtrisez les verbes réguliers et irréguliers.</p>
        </Link>
        <Link to="/fr/vocab" className="card hover:scale-105 transition-transform text-center p-8 flex flex-col items-center justify-center border-l-4 relative overflow-hidden group" style={{ borderColor: 'var(--primary)' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="text-5xl mb-4 relative z-10">📚</div>
          <h2 className="text-2xl font-bold mb-2 relative z-10">Vocabulaire</h2>
          <p className="text-sm opacity-70 relative z-10">Enrichissez votre lexique français.</p>
        </Link>
        <Link to="/fr/geography" className="card hover:scale-105 transition-transform text-center p-8 flex flex-col items-center justify-center md:col-span-2 border-l-4 relative overflow-hidden group" style={{ borderColor: 'var(--primary)' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="text-5xl mb-4 relative z-10">🗺️</div>
          <h2 className="text-2xl font-bold mb-2 relative z-10">Géographie</h2>
          <p className="text-sm opacity-70 relative z-10">Apprenez les départements français et plus.</p>
        </Link>
      </div>

      <Link to="/" className="fixed top-4 left-4 glass px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-white/10 transition z-50">
        🏠 Accueil
      </Link>
    </div>
  );
}
