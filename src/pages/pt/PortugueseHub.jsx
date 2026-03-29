import React from 'react';
import { Link } from 'react-router-dom';

export default function PortugueseHub() {
  return (
    <div className="hub-container p-6 animate-fade-in flex flex-col items-center min-h-screen">
      <div className="w-full max-w-2xl text-center mb-10 pt-10">
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-md theme-gradient-text" style={{ fontFamily: 'var(--font-main)' }}>
          Academia Portuguesa 🇧🇷
        </h1>
        <p className="text-lg opacity-80 mx-auto max-w-xl text-[var(--text)]">
          Descubra a beleza do português. Pratique a conjugação ao som do oceano.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 w-full max-w-2xl">
        <Link to="/pt/conjugation" className="card hover:scale-105 transition-transform text-center p-10 flex flex-col items-center justify-center border-l-4 relative overflow-hidden group" style={{ borderColor: 'var(--primary)' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="text-5xl mb-4 relative z-10 drop-shadow-sm">🌊</div>
          <h2 className="text-3xl font-bold mb-2 relative z-10 text-[var(--primary)]">Conjugação</h2>
          <p className="text-md opacity-80 relative z-10 text-[var(--accent)]">Domine os verbos regulares e irregulares passo a passo.</p>
        </Link>
      </div>

      <div className="mt-12 text-center opacity-60">
        <p className="text-sm">Mais módulos em breve...</p>
      </div>

      <Link to="/" className="fixed top-4 left-4 glass px-4 py-2 rounded-xl text-[var(--text)] text-sm font-bold shadow-lg hover:bg-white/20 transition z-50 border border-white/10">
        🏠 Início
      </Link>
    </div>
  );
}
