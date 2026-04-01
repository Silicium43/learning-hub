import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import localforage from 'localforage';

export default function FrenchHub() {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    localforage.getItem('fra_source_lang').then(l => {
      if (l) setLang(l);
    });
  }, []);

  const toggleLang = (val) => {
    setLang(val);
    localforage.setItem('fra_source_lang', val);
  };

  const t = {
    en: {
      title: "French Academy 🇫🇷",
      desc: "The refinement of the language. Explore our collection of premium exercises.",
      conj: "Conjugation",
      conjDesc: "Master regular and irregular verbs.",
      vocab: "Vocabulary",
      vocabDesc: "Expand your French lexicon.",
      home: "🏠 Home"
    },
    es: {
      title: "Academia Francesa 🇫🇷",
      desc: "El refinamiento del idioma. Explora nuestra colección de ejercicios premium.",
      conj: "Conjugación",
      conjDesc: "Domina verbos regulares e irregulares.",
      vocab: "Vocabulario",
      vocabDesc: "Enriquece tu léxico francés.",
      home: "🏠 Inicio"
    }
  };

  const cur = t[lang];

  return (
    <div className="hub-container p-6 animate-fade-in flex flex-col items-center min-h-screen">
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <button 
          onClick={() => toggleLang('en')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${lang === 'en' ? 'bg-[var(--primary)] text-[var(--bg)] border-[var(--primary)]' : 'bg-white/5 border-white/10 opacity-60'}`}
        >
          🇬🇧 EN
        </button>
        <button 
          onClick={() => toggleLang('es')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${lang === 'es' ? 'bg-[var(--primary)] text-[var(--bg)] border-[var(--primary)]' : 'bg-white/5 border-white/10 opacity-60'}`}
        >
          🇪🇸 ES
        </button>
      </div>

      <div className="w-full max-w-2xl text-center mb-10 pt-10">
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-md theme-gradient-text" style={{ fontFamily: 'var(--font-main)' }}>
          {cur.title}
        </h1>
        <p className="text-lg opacity-80 mx-auto max-w-xl">
          {cur.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Link to="/fr/conjugation" className="card hover:scale-105 transition-transform text-center p-8 flex flex-col items-center justify-center border-l-4 relative overflow-hidden group" style={{ borderColor: 'var(--primary)' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="text-5xl mb-4 relative z-10">✍️</div>
          <h2 className="text-2xl font-bold mb-2 relative z-10">{cur.conj}</h2>
          <p className="text-sm opacity-70 relative z-10">{cur.conjDesc}</p>
        </Link>
        <Link to="/fr/vocab" className="card hover:scale-105 transition-transform text-center p-8 flex flex-col items-center justify-center border-l-4 relative overflow-hidden group" style={{ borderColor: 'var(--primary)' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="text-5xl mb-4 relative z-10">📚</div>
          <h2 className="text-2xl font-bold mb-2 relative z-10">{cur.vocab}</h2>
          <p className="text-sm opacity-70 relative z-10">{cur.vocabDesc}</p>
        </Link>
      </div>

      <Link to="/" className="fixed top-4 left-4 glass px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-white/10 transition z-50">
        {cur.home}
      </Link>
    </div>
  );
}
