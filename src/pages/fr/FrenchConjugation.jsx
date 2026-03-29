import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import localforage from 'localforage';

const db = {
    people: ["Je", "Tu", "Il/Elle", "Nous", "Vous", "Ils/Elles"],
    verbs: [
        { fr: "Être", en: "to be", es: "ser/estar", level: 2, irr: { "Présent": ["suis", "es", "est", "sommes", "êtes", "sont"], "Passé Composé": ["ai été", "as été", "a été", "avons été", "avez été", "ont été"] } },
        { fr: "Avoir", en: "to have", es: "tener", level: 2, irr: { "Présent": ["ai", "as", "a", "avons", "avez", "ont"], "Passé Composé": ["ai eu", "as eu", "a eu", "avons eu", "avez eu", "ont eu"] } },
        { fr: "Aller", en: "to go", es: "ir", level: 2, irr: { "Présent": ["vais", "vas", "va", "allons", "allez", "vont"], "Passé Composé": ["suis allé", "es allé", "est allé", "sommes allés", "êtes allés", "sont allés"] } },
        { fr: "Aimer", en: "to love", es: "amar", level: 1, group: "er" }, 
        { fr: "Manger", en: "to eat", es: "comer", level: 1, group: "er" },
        { fr: "Parler", en: "to speak", es: "hablar", level: 1, group: "er" },
        { fr: "Travailler", en: "to work", es: "trabajar", level: 1, group: "er" },
        { fr: "Finir", en: "to finish", es: "terminar", level: 1, group: "ir" },
        { fr: "Faire", en: "to do/make", es: "hacer", level: 3, irr: { "Présent": ["fais", "fais", "fait", "faisons", "faites", "font"], "Passé Composé": ["ai fait", "as fait", "a fait", "avons fait", "avez fait", "ont fait"] } },
        { fr: "Prendre", en: "to take", es: "tomar", level: 3, irr: { "Présent": ["prends", "prends", "prend", "prenons", "prenez", "prennent"], "Passé Composé": ["ai pris", "as pris", "a pris", "avons pris", "avez pris", "ont pris"] } }
    ]
};

export default function FrenchConjugation() {
  const [userData, setUserData] = useState({ streak: 0, bestStreak: 0, verbs: {} });
  const [screen, setScreen] = useState('setup');
  const [currQ, setCurrQ] = useState(null);
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [level, setLevel] = useState(3);
  const [tense, setTense] = useState("Présent");
  const [focusMode, setFocusMode] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    localforage.getItem('fra_master_react').then(data => {
      if (data) setUserData(data);
    });
  }, []);

  const saveUserData = (newData) => {
    setUserData(newData);
    localforage.setItem('fra_master_react', newData);
  };

  const startQuiz = (focus) => {
    setFocusMode(focus);
    setScreen('quiz');
    nextQuestion(focus);
  };

  const nextQuestion = (isFocus = focusMode) => {
    setIsWaiting(false);
    setFeedback(null);
    setInputVal('');
    
    let pool = db.verbs.filter(v => (level === 1 ? v.level === 1 : (level === 2 ? v.level <= 2 : true)));
    
    if (isFocus) {
      const errPool = pool.filter(v => userData.verbs[v.fr] && userData.verbs[v.fr].err > 0);
      if (errPool.length > 0) pool = errPool;
      else {
        setScreen('setup');
        alert("Bravo! Plus de faiblesses pour ce mode.");
        return;
      }
    }

    const verb = pool[Math.floor(Math.random() * pool.length)];
    const pIdx = Math.floor(Math.random() * 6);
    
    let answer = "";
    if (verb.irr) {
        answer = verb.irr[tense][pIdx];
    } else {
        const root = verb.fr.slice(0, -2);
        if (tense === "Présent") {
            const ends = verb.group === "er" ? ["e", "es", "e", "ons", "ez", "ent"] : ["is", "is", "it", "issons", "issez", "issent"];
            answer = root + ends[pIdx];
        } else {
            const aux = ["ai", "as", "a", "avons", "avez", "ont"];
            answer = aux[pIdx] + " " + (verb.group === "er" ? root.toLowerCase() + "é" : root.toLowerCase() + "i");
        }
    }

    let person = db.people[pIdx];
    if (person === "Je" && /^[aeiouh]/i.test(answer)) person = "J'";
    
    setCurrQ({ verb: verb.fr, tense: tense, person: person, answer: answer, trans: verb.en });
    
    setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && currQ) {
      const val = inputVal.trim().toLowerCase();
      const correct = currQ.answer.toLowerCase();
      const newUserData = { ...userData };
      if (!newUserData.verbs[currQ.verb]) newUserData.verbs[currQ.verb] = { err: 0, ok: 0 };

      if (val === correct) {
        if (!isWaiting) {
          newUserData.verbs[currQ.verb].ok++;
          newUserData.streak++;
          if (newUserData.streak > (newUserData.bestStreak || 0)) newUserData.bestStreak = newUserData.streak;
        } else if (focusMode && newUserData.verbs[currQ.verb].err > 0) {
          newUserData.verbs[currQ.verb].err--;
        }
        
        setFeedback({ status: 'success', text: "Excellent!" });
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

  const hasErrors = Object.values(userData.verbs).some(v => v.err > 0);

  const topErrors = Object.entries(userData.verbs)
    .filter(([_, data]) => data.err > 0)
    .sort((a, b) => b[1].err - a[1].err)
    .slice(0, 5);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in relative pt-16">
      <Link to="/fr" className="fixed top-4 left-4 glass px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-white/10 transition z-50">
        🔙 Retour
      </Link>

      <div className="w-full max-w-md w-full">
        {screen === 'setup' ? (
          <>
            <div className="text-center mb-6">
              <div className="text-lg font-bold text-[var(--primary)] mb-2 drop-shadow-sm flex items-center justify-center gap-2">
                🔥 Streak: {userData.streak} <span className="opacity-50 text-sm">(Record: {userData.bestStreak || 0})</span>
              </div>
              <h1 className="text-4xl font-black mb-2 theme-gradient-text" style={{ fontFamily: 'var(--font-main)' }}>Conjugaison ✍️</h1>
            </div>

            <div className="glass p-6 rounded-2xl shadow-xl w-full border border-white/5 relative z-10 mb-6">
              <label className="block text-sm opacity-70 mb-2 font-semibold tracking-wide">Niveau :</label>
              <select value={level} onChange={e => setLevel(Number(e.target.value))} className="w-full p-4 rounded-xl border border-white/10 bg-black/40 text-white mb-4 outline-none focus:border-[var(--primary)] transition">
                <option value={1}>Niveau 1: Réguliers (ER/IR)</option>
                <option value={2}>Niveau 2: Essentiels</option>
                <option value={3}>Niveau 3: Tous les verbes</option>
              </select>

              <label className="block text-sm opacity-70 mb-2 font-semibold tracking-wide">Temps :</label>
              <select value={tense} onChange={e => setTense(e.target.value)} className="w-full p-4 rounded-xl border border-white/10 bg-black/40 text-white mb-6 outline-none focus:border-[var(--primary)] transition">
                <option value="Présent">Présent</option>
                <option value="Passé Composé">Passé Composé</option>
              </select>

              <button onClick={() => startQuiz(false)} className="w-full p-4 rounded-xl bg-[var(--primary)] text-[var(--bg)] font-bold uppercase tracking-wider hover:opacity-90 transition mb-3 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                Commencer 🚀
              </button>
              
              {hasErrors && (
                <button onClick={() => startQuiz(true)} className="w-full p-4 rounded-xl bg-indigo-600 text-white font-bold uppercase tracking-wider hover:bg-indigo-500 transition shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                  Points Faibles ⚡
                </button>
              )}
            </div>

            {topErrors.length > 0 && (
              <div className="glass p-6 rounded-2xl shadow-xl w-full border border-white/5 relative z-10">
                <h3 className="text-md font-bold mb-4 opacity-80 uppercase tracking-widest text-[var(--primary)]">Top Erreurs</h3>
                <div className="space-y-2">
                  {topErrors.map(([verb, stats]) => (
                    <div key={verb} className="flex justify-between items-center bg-black/20 p-2 rounded px-4 text-sm">
                      <span className="font-bold">{verb}</span>
                      <div className="flex gap-4">
                        <span className="text-rose-400 font-mono text-xs">{stats.err} Err</span>
                        <span className="text-emerald-400 font-mono text-xs">{stats.ok} Ok</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center w-full">
            <div className="w-full flex justify-between items-center mb-6 px-2">
              <button onClick={() => setScreen('setup')} className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition px-3 py-1 bg-white/5 rounded">
                Menu
              </button>
              <div className="text-sm font-bold text-[var(--primary)] drop-shadow-sm flex items-center justify-center gap-1">
                🔥 {userData.streak}
              </div>
            </div>

            <div className="glass p-8 rounded-2xl shadow-2xl w-full border border-white/10 text-center relative overflow-hidden">
               {focusMode && <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500"></div>}
               
               {currQ && (
                 <>
                   <div className="text-4xl md:text-5xl font-black text-[var(--primary)] mb-2" style={{ fontFamily: 'var(--font-main)' }}>{currQ.verb}</div>
                   <div className="text-lg italic opacity-50 mb-6 font-serif">{currQ.trans}</div>
                   
                   <div className="text-xs uppercase font-bold tracking-[0.2em] opacity-60 mb-2">{currQ.tense}</div>
                   <div className="text-2xl font-medium mb-6 bg-white/5 inline-block px-6 py-2 rounded-xl text-shadow-sm">{currQ.person}...</div>
                   
                   <input 
                     ref={inputRef}
                     type="text" 
                     value={inputVal}
                     onChange={e => setInputVal(e.target.value)}
                     onKeyDown={handleKeyPress}
                     placeholder="Tapez la réponse..."
                     autoComplete="off" autoCorrect="off" spellCheck="false" autoCapitalize="none"
                     className={`w-full p-4 rounded-xl border-2 text-center text-lg md:text-xl font-bold bg-black/40 text-white outline-none transition-all shadow-inner ${feedback?.status === 'error' ? 'border-rose-500 bg-rose-500/10' : 'border-white/10 focus:border-[var(--primary)]'}`}
                   />
                   
                   <div className="h-14 mt-4 flex items-center justify-center">
                     {feedback && (
                       <div className={`font-bold text-lg ${feedback.status === 'success' ? 'text-emerald-400' : 'text-rose-400 animate-shake'}`}>
                         {feedback.text}
                       </div>
                     )}
                   </div>

                   {isWaiting && (
                     <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 animate-fade-in text-left">
                       <span className="text-xs uppercase tracking-widest opacity-50 block mb-1">Réponse attendue</span>
                       <span className="text-2xl font-bold text-[var(--primary)] font-serif block">{currQ.answer}</span>
                       <div className="text-xs opacity-50 mt-3 flex items-center gap-2">
                         <span className="inline-block px-2 py-1 bg-white/10 rounded">Entrée↵</span> pour continuer
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
