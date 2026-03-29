import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import localforage from 'localforage';

const endings = {
  "Presente": {
      "ar": ["o", "as", "a", "amos", "an", "an"],
      "er": ["o", "es", "e", "emos", "en", "en"],
      "ir": ["o", "es", "e", "imos", "en", "en"]
  },
  "Futuro": {
      "all": ["é", "ás", "á", "emos", "án", "án"]
  },
  "Pretérito Indefinido": {
      "ar": ["é", "aste", "ó", "amos", "aron", "aron"],
      "er": ["í", "iste", "ió", "imos", "ieron", "ieron"],
      "ir": ["í", "iste", "ió", "imos", "ieron", "ieron"]
  }
};

const db = {
  people: ["Yo", "Tú", "Él/Ella", "Nosotros", "Ustedes", "Ellos/Ellas"],
  verbs: [
      { es: "Hablar", fr: "Parler", en: "To speak", group: "ar" },
      { es: "Comer", fr: "Manger", en: "To eat", group: "er" },
      { es: "Vivir", fr: "Vivre", en: "To live", group: "ir" },
      { es: "Ser", fr: "Être", en: "To be", irr: true, 
          "Presente": ["soy", "eres", "es", "somos", "sois", "son"],
          "Futuro": ["seré", "serás", "será", "seremos", "seréis", "serán"],
          "Pretérito Perfecto": ["he sido", "has sido", "ha sido", "hemos sido", "habéis sido", "han sido"],
          "Pretérito Indefinido": ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"]
      },
      { es: "Ir", fr: "Aller", en: "To go", irr: true,
          "Presente": ["voy", "vas", "va", "vamos", "vais", "vont"],
          "Pretérito Indefinido": ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"]
      }
  ]
};

export default function SpanishConjugation() {
  const [userData, setUserData] = useState({ streak: 0, bestStreak: 0, verbs: {} });
  const [screen, setScreen] = useState('setup');
  const [currQ, setCurrQ] = useState(null);
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [tense, setTense] = useState("Presente");
  const [includeIrr, setIncludeIrr] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [uiLang, setUiLang] = useState('fr');
  const inputRef = useRef(null);

  useEffect(() => {
    localforage.getItem('esp_master_react').then(data => {
      if (data) setUserData(data);
    });
  }, []);

  const saveUserData = (newData) => {
    setUserData(newData);
    localforage.setItem('esp_master_react', newData);
  };

  const startQuiz = () => {
    setScreen('quiz');
    nextQuestion();
  };

  const nextQuestion = () => {
    setIsWaiting(false);
    setFeedback(null);
    setInputVal('');
    
    let pool = db.verbs.filter(v => includeIrr ? true : !v.irr);
    if(pool.length === 0) pool = db.verbs; // Fallback

    const verb = pool[Math.floor(Math.random() * pool.length)];
    const pIdx = Math.floor(Math.random() * 6);
    const conjIdx = (pIdx === 4) ? 5 : pIdx; // Ustedes uses Ellos conjugation
    
    let answer = "";
    let rule = "";

    if (verb.irr && verb[tense]) { 
      answer = verb[tense][conjIdx];
      rule = "Verbo irregular";
    } else {
      const root = verb.es.slice(0, -2).toLowerCase();
      const group = verb.group;

      if (tense === "Presente" && endings["Presente"][group]) {
          const term = endings["Presente"][group][conjIdx];
          answer = root + term;
          rule = `${root} + ${term}`;
      } 
      else if (tense === "Futuro" && endings["Futuro"]["all"]) {
          const term = endings["Futuro"]["all"][conjIdx];
          answer = verb.es.toLowerCase() + term;
          rule = `${verb.es.toLowerCase()} + ${term}`;
      } 
      else if (tense === "Pretérito Indefinido" && endings["Pretérito Indefinido"][group]) {
          const term = endings["Pretérito Indefinido"][group][conjIdx];
          answer = root + term;
          rule = `${root} + ${term}`;
      } 
      else if (tense === "Pretérito Perfecto") {
          const aux = ["he", "has", "ha", "hemos", "han", "han"];
          const participio = (group === "ar") ? root + "ado" : root + "ido";
          answer = aux[conjIdx] + " " + participio;
          rule = `${aux[conjIdx]} + ${participio}`;
      } else {
          // Fallback if tense not defined for irregular
          answer = verb.es.toLowerCase() + " (not implemented)";
      }
    }

    setCurrQ({ 
      verb: verb.es, 
      tense: tense, 
      person: db.people[pIdx], 
      answer: answer.toLowerCase(), 
      trans: verb[uiLang],
      rule: rule
    });
    
    setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && currQ) {
      const val = inputVal.trim().toLowerCase();
      const correct = currQ.answer.toLowerCase();
      const newUserData = { ...userData };
      if (!newUserData.verbs[currQ.verb]) newUserData.verbs[currQ.verb] = { err: 0 };

      if (val === correct) {
        if (!isWaiting) {
          newUserData.streak++;
          if (newUserData.streak > (newUserData.bestStreak || 0)) newUserData.bestStreak = newUserData.streak;
        }
        setFeedback({ status: 'success', text: "¡Excelente!" });
        saveUserData(newUserData);
        setTimeout(() => nextQuestion(), 800);
      } else {
        setIsWaiting(true);
        newUserData.verbs[currQ.verb].err++;
        newUserData.streak = 0;
        setFeedback({ status: 'error', text: `Correction:` });
        setInputVal('');
        saveUserData(newUserData);
      }
    }
  };

  const topErrors = Object.entries(userData.verbs)
    .filter(([_, data]) => data.err > 0)
    .sort((a, b) => b[1].err - a[1].err)
    .slice(0, 5);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in relative pt-16">
      <Link to="/es" className="fixed top-4 left-4 glass px-4 py-2 rounded-xl text-[var(--text)] text-sm font-bold shadow-lg hover:bg-white/50 transition z-50">
        🔙 Volver
      </Link>

      <div className="w-full max-w-md w-full">
        {screen === 'setup' ? (
          <>
            <div className="text-center mb-6">
              <div className="text-lg font-bold text-[var(--accent)] mb-2 drop-shadow-sm flex items-center justify-center gap-2">
                🔥 Racha: {userData.streak} <span className="opacity-50 text-sm">(Récord: {userData.bestStreak || 0})</span>
              </div>
              <h1 className="text-4xl font-black mb-2 theme-gradient-text" style={{ fontFamily: 'var(--font-main)' }}>Conjugación ✍️</h1>
            </div>

            <div className="card p-6 rounded-2xl shadow-xl w-full border border-[var(--border)] relative z-10 mb-6 bg-white/80 backdrop-blur-md">
              <label className="block text-sm opacity-70 mb-2 font-semibold tracking-wide text-[var(--text)]">Idioma / Language:</label>
              <select value={uiLang} onChange={e => setUiLang(e.target.value)} className="w-full p-4 rounded-xl border border-[var(--border)] bg-white/50 text-[var(--text)] mb-4 outline-none focus:border-[var(--primary)] transition font-serif drop-shadow-sm">
                <option value="fr">Français 🇫🇷</option>
                <option value="en">English 🇬🇧</option>
              </select>

              <label className="block text-sm opacity-70 mb-2 font-semibold tracking-wide text-[var(--text)]">Tiempo / Tense:</label>
              <select value={tense} onChange={e => setTense(e.target.value)} className="w-full p-4 rounded-xl border border-[var(--border)] bg-white/50 text-[var(--text)] mb-4 outline-none focus:border-[var(--primary)] transition font-serif drop-shadow-sm">
                <option value="Presente">Presente</option>
                <option value="Futuro">Futuro</option>
                <option value="Pretérito Perfecto">Pretérito Perfecto (Passé C.)</option>
                <option value="Pretérito Indefinido">Pretérito Indefinido (Passé S.)</option>
              </select>

              <label className="flex items-center gap-3 mb-6 p-2 cursor-pointer text-[var(--text)] opacity-80 hover:opacity-100 transition">
                <input type="checkbox" checked={includeIrr} onChange={e => setIncludeIrr(e.target.checked)} className="w-5 h-5 accent-[var(--primary)]" />
                <span className="font-semibold font-serif">Inclure les irréguliers / Include irregulars</span>
              </label>

              <button onClick={() => startQuiz()} className="w-full p-4 rounded-xl bg-[var(--primary)] text-white font-bold uppercase tracking-wider hover:opacity-90 transition mb-3 shadow-lg">
                ¡Vamos! 🚀
              </button>
            </div>

            {topErrors.length > 0 && (
              <div className="card p-6 rounded-2xl shadow-xl w-full border border-[var(--border)] relative z-10 bg-white/80 backdrop-blur-md">
                <h3 className="text-md font-bold mb-4 opacity-80 uppercase tracking-widest text-[var(--accent)]">Top 5 Errores</h3>
                <div className="space-y-2">
                  {topErrors.map(([verb, stats]) => (
                    <div key={verb} className="flex justify-between items-center bg-[var(--bg)]/50 p-2 rounded px-4 text-sm text-[var(--text)]">
                      <span className="font-bold font-serif">{verb}</span>
                      <span className="text-rose-500 font-mono text-xs font-bold">{stats.err} Err</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center w-full">
            <div className="w-full flex justify-between items-center mb-6 px-2">
              <button onClick={() => setScreen('setup')} className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition px-3 py-1 bg-black/5 rounded text-[var(--text)]">
                Menú
              </button>
              <div className="text-sm font-bold text-[var(--accent)] drop-shadow-sm flex items-center justify-center gap-1">
                🔥 {userData.streak}
              </div>
            </div>

            <div className="card p-8 rounded-2xl shadow-2xl w-full border border-[var(--border)] text-center relative overflow-hidden bg-white/90 backdrop-blur-md">
               {currQ && (
                 <>
                   <div className="text-4xl md:text-5xl font-black text-[var(--primary)] mb-2" style={{ fontFamily: 'var(--font-main)' }}>{currQ.verb}</div>
                   <div className="text-lg italic opacity-70 mb-6 font-serif text-[var(--text)]">{currQ.trans}</div>
                   
                   <div className="text-xs uppercase font-bold tracking-[0.2em] opacity-60 mb-2 text-[var(--text)]">{currQ.tense}</div>
                   <div className="text-2xl font-medium mb-6 bg-black/5 inline-block px-6 py-2 rounded-xl text-shadow-sm text-[var(--text)]">{currQ.person} ...</div>
                   
                   <input 
                     ref={inputRef}
                     type="text" 
                     value={inputVal}
                     onChange={e => setInputVal(e.target.value)}
                     onKeyDown={handleKeyPress}
                     placeholder={uiLang === 'en' ? 'Type the answer...' : 'Tapez la réponse...'}
                     autoComplete="off" autoCorrect="off" spellCheck="false" autoCapitalize="none"
                     className={`w-full p-4 rounded-xl border-2 text-center text-lg md:text-xl font-bold bg-white/50 text-[var(--text)] outline-none transition-all shadow-inner ${feedback?.status === 'error' ? 'border-rose-400 bg-rose-50' : 'border-[var(--border)] focus:border-[var(--primary)]'}`}
                   />
                   
                   <div className="h-14 mt-4 flex items-center justify-center">
                     {feedback && (
                       <div className={`font-bold text-lg ${feedback.status === 'success' ? 'text-emerald-500' : 'text-rose-500 animate-shake'}`}>
                         {feedback.text}
                       </div>
                     )}
                   </div>

                   {isWaiting && (
                     <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-200 animate-fade-in text-left shadow-sm">
                       <span className="text-xs uppercase tracking-widest opacity-60 block mb-1 text-[var(--text)]">Respuestas y Reglas</span>
                       <span className="text-2xl font-bold text-[var(--primary)] font-serif block">{currQ.answer}</span>
                       <span className="text-sm italic block text-[var(--accent)] mt-1">{currQ.rule}</span>
                       <div className="text-xs opacity-60 mt-3 flex items-center gap-2 text-[var(--text)]">
                         <span className="inline-block px-2 py-1 bg-black/10 rounded font-bold">Enter↵</span> para continuar
                       </div>
                     </div>
                   )}
                 </>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
