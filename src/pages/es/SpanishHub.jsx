import React from 'react';
import { Link } from 'react-router-dom';

export default function SpanishHub() {
  return (
    <div className="hub-container p-6 animate-fade-in flex flex-col items-center min-h-screen">
      <div className="w-full max-w-2xl text-center mb-10 pt-10">
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-md theme-gradient-text" style={{ fontFamily: 'var(--font-main)' }}>
          Academia Española 🇪🇸
        </h1>
        <p className="text-lg opacity-80 mx-auto max-w-xl font-serif italic text-[var(--accent)]">
          Bienvenidos a la villa mediterránea. Perfeccionen sus verbos y gramática bajo el sol.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 w-full max-w-2xl">
        <Link to="/es/conjugation" className="card hover:scale-105 transition-transform text-center p-10 flex flex-col items-center justify-center border-l-4 relative overflow-hidden group" style={{ borderColor: 'var(--primary)' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="text-5xl mb-4 relative z-10 drop-shadow-sm">🌞</div>
          <h2 className="text-3xl font-bold mb-2 relative z-10 font-serif text-[var(--primary)]">Conjugación</h2>
          <p className="text-md opacity-80 relative z-10 text-[var(--text)]">Practica los verbos regulares, irregulares y sus tiempos.</p>
        </Link>
      </div>

      <div className="mt-12 text-center opacity-60">
        <p className="text-sm font-serif italic">Más módulos coming soon...</p>
      </div>

      <Link to="/" className="fixed top-4 left-4 glass px-4 py-2 rounded-xl text-[var(--text)] text-sm font-bold shadow-lg hover:bg-white/50 transition z-50">
        🏠 Inicio
      </Link>
    </div>
  );
}
