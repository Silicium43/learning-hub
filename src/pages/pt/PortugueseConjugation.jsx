import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import localforage from 'localforage';

const endings = {
  "Presente": {
      "ar": ["o", "as", "a", "amos", "am", "am"],
      "er": ["o", "es", "e", "emos", "em", "em"],
      "ir": ["o", "es", "e", "imos", "em", "em"]
  },
  "Futuro": {
      "all": ["ei", "ás", "á", "emos", "ão", "ão"]
  },
  "Pretérito Perfeito": {
      "ar": ["ei", "aste", "ou", "amos", "aram", "aram"],
      "er": ["i", "este", "eu", "emos", "eram", "eram"],
      "ir": ["i", "iste", "iu", "imos", "iram", "iram"]
  },
  "Pretérito Imperfeito": {
      "ar": ["ava", "avas", "ava", "ávamos", "avam", "avam"],
      "er": ["ia", "ias", "ia", "íamos", "iam", "iam"],
      "ir": ["ia", "ias", "ia", "íamos", "iam", "iam"]
  }
};

const db = {
  people: ["Eu", "Tu", "Ele/Ela", "Nós", "Vocês", "Eles/Elas"],
  verbs: [
      { pt: "Falar", fr: "Parler", en: "Speak", group: "ar" },
      { pt: "Gostar", fr: "Aimer (bien)", en: "Like", group: "ar" },
      { pt: "Trabalhar", fr: "Travailler", en: "Work", group: "ar" },
      { pt: "Estudar", fr: "Étudier", en: "Study", group: "ar" },
      { pt: "Comprar", fr: "Acheter", en: "Buy", group: "ar" },
      { pt: "Cantar", fr: "Chanter", en: "Sing", group: "ar" },
      { pt: "Dan\u00e7ar", fr: "Danser", en: "Dance", group: "ar" },
      { pt: "Andar", fr: "Marcher", en: "Walk", group: "ar" },
      { pt: "Ficar", fr: "Rester", en: "Stay", group: "ar" },
      { pt: "Lembrar", fr: "Se souvenir", en: "Remember", group: "ar" },
      { pt: "Esperar", fr: "Attendre/Esp\u00e9rer", en: "Wait", group: "ar" },
      { pt: "Achar", fr: "Trouver/Penser", en: "Find/Think", group: "ar" },
      { pt: "Levar", fr: "Emmener", en: "Take", group: "ar" },
      { pt: "Chegar", fr: "Arriver", en: "Arrive", group: "ar" },
      { pt: "Olhar", fr: "Regarder", en: "Look", group: "ar" },
      { pt: "Tirar", fr: "Retirer", en: "Take out", group: "ar" },
      
      { pt: "Comer", fr: "Manger", en: "Eat", group: "er" },
      { pt: "Beber", fr: "Boire", en: "Drink", group: "er" },
      { pt: "Vender", fr: "Vendre", en: "Sell", group: "er" },
      { pt: "Correr", fr: "Courir", en: "Run", group: "er" },
      { pt: "Escrever", fr: "Écrire", en: "Write", group: "er" },
      { pt: "Aprender", fr: "Apprendre", en: "Learn", group: "er" },
      { pt: "Entender", fr: "Comprendre", en: "Understand", group: "er" },
      { pt: "Receber", fr: "Recevoir", en: "Receive", group: "er" },
      { pt: "Viver", fr: "Vivre", en: "Live", group: "er" },
      { pt: "Bater", fr: "Frapper", en: "Hit", group: "er" },
      
      { pt: "Abrir", fr: "Ouvrir", en: "Open", group: "ir" },
      { pt: "Partir", fr: "Partir", en: "Leave", group: "ir" },
      { pt: "Assistir", fr: "Regarder (TV)", en: "Watch", group: "ir" },
      { pt: "Dividir", fr: "Diviser", en: "Divide", group: "ir" },
      { pt: "Decidir", fr: "D\u00e9cider", en: "Decide", group: "ir" },
      { pt: "Subir", fr: "Monter", en: "Go up", group: "ir" },
      { pt: "Desistir", fr: "Abandonner", en: "Give up", group: "ir" },
      { pt: "Permitir", fr: "Permettre", en: "Allow", group: "ir" },

      { pt: "Ser", fr: "Être (permanent)", en: "To be", irr: true,
          "Presente": ["sou", "és", "é", "somos", "são", "são"],
          "Pretérito Perfeito": ["fui", "foste", "foi", "fomos", "foram", "foram"],
          "Pretérito Imperfeito": ["era", "eras", "era", "éramos", "eram", "eram"]
      },
      { pt: "Estar", fr: "Être (temporaire)", en: "To be", irr: true,
          "Presente": ["estou", "estás", "está", "estamos", "estão", "estão"],
          "Pretérito Perfeito": ["estive", "estiveste", "esteve", "estivemos", "estiveram", "estiveram"],
          "Pretérito Imperfeito": ["estava", "estavas", "estava", "estávamos", "estavam", "estavam"]
      },
      { pt: "Ter", fr: "Avoir", en: "To have", irr: true,
          "Presente": ["tenho", "tens", "tem", "temos", "têm", "têm"],
          "Pretérito Perfeito": ["tive", "tiveste", "teve", "tivemos", "tiveram", "tiveram"],
          "Pretérito Imperfeito": ["tinha", "tinhas", "tinha", "tínhamos", "tinham", "tinham"]
      },
      { pt: "Ir", fr: "Aller", en: "To go", irr: true,
          "Presente": ["vou", "vais", "vai", "vamos", "vão", "vão"],
          "Pretérito Perfeito": ["fui", "foste", "foi", "fomos", "foram", "foram"],
          "Pretérito Imperfeito": ["ia", "ias", "ia", "íamos", "iam", "iam"]
      },
      { pt: "Fazer", fr: "Faire", en: "To do", irr: true,
          "Presente": ["faço", "fazes", "faz", "fazemos", "fazem", "fazem"],
          "Pretérito Perfeito": ["fiz", "fizeste", "fez", "fizemos", "fizeram", "fizeram"],
          "Pretérito Imperfeito": ["fazia", "fazias", "fazia", "fazíamos", "faziam", "faziam"]
      },
      { pt: "Poder", fr: "Pouvoir", en: "Can", irr: true,
          "Presente": ["posso", "podes", "pode", "podemos", "podem", "podem"],
          "Pretérito Perfeito": ["pude", "pudeste", "pôde", "pudemos", "puderam", "puderam"]
      },
      { pt: "Dizer", fr: "Dire", en: "To say", irr: true,
          "Presente": ["digo", "dizes", "diz", "dizemos", "dizem", "dizem"],
          "Pretérito Perfeito": ["disse", "disseste", "disse", "dissemos", "disseram", "disseram"]
      },
      { pt: "Querer", fr: "Vouloir", en: "Want", irr: true,
          "Presente": ["quero", "queres", "quer", "queremos", "querem", "querem"],
          "Pretérito Perfeito": ["quis", "quiseste", "quis", "quisemos", "quiseram", "quiseram"]
      },
      { pt: "Ver", fr: "Voir", en: "See", irr: true,
          "Presente": ["vejo", "vês", "vê", "vemos", "veem", "veem"],
          "Pretérito Perfeito": ["vi", "viste", "viu", "vimos", "viram", "viram"]
      },
      { pt: "Saber", fr: "Savoir", en: "Know", irr: true,
          "Presente": ["sei", "sabes", "sabe", "sabemos", "sabem", "sabem"],
          "Pretérito Perfeito": ["soube", "soubeste", "soube", "soubemos", "souberam", "souberam"]
      }
  ]
};

export default function PortugueseConjugation() {
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
    localforage.getItem('pt_master_react').then(data => {
      if (data) setUserData(data);
    });
  }, []);

  const saveUserData = (newData) => {
    setUserData(newData);
    localforage.setItem('pt_master_react', newData);
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
    if(pool.length === 0) pool = db.verbs;

    const verb = pool[Math.floor(Math.random() * pool.length)];
    const pIdx = Math.floor(Math.random() * 6);
    const conjIdx = (pIdx === 4) ? 5 : pIdx; // Voces uses Eles conjugation
    
    let answer = "";
    let rule = "";

    if (verb.irr && verb[tense]) { 
      answer = verb[tense][conjIdx];
      rule = "Verbo irregular";
    } else {
      const root = verb.pt.slice(0, -2).toLowerCase();
      const group = verb.group;

      if (tense === "Futuro" && endings["Futuro"]["all"]) {
          const term = endings["Futuro"]["all"][conjIdx];
          answer = verb.pt.toLowerCase() + term;
          rule = `${verb.pt.toLowerCase()} + ${term}`;
      } 
      else if (endings[tense] && endings[tense][group]) {
          const term = endings[tense][group][conjIdx];
          answer = root + term;
          rule = `${root} + ${term}`;
      } else {
          answer = verb.pt.toLowerCase() + " (not implemented)";
      }
    }

    setCurrQ({ 
      verb: verb.pt, 
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
        setFeedback({ status: 'success', text: "Muito Bém!" });
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
      <Link to="/pt" className="fixed top-4 left-4 glass px-4 py-2 rounded-xl text-[var(--text)] text-sm font-bold shadow-lg hover:bg-white/20 transition z-50 border border-white/10">
        🔙 Voltar
      </Link>

      <div className="w-full max-w-md w-full">
        {screen === 'setup' ? (
          <>
            <div className="text-center mb-6">
              <div className="text-lg font-bold text-[var(--primary)] mb-2 drop-shadow-sm flex items-center justify-center gap-2">
                🔥 Racha: {userData.streak} <span className="opacity-50 text-sm">(Record: {userData.bestStreak || 0})</span>
              </div>
              <h1 className="text-4xl font-black mb-2 theme-gradient-text" style={{ fontFamily: 'var(--font-main)' }}>Conjugação ✍️</h1>
            </div>

            <div className="card p-6 rounded-2xl shadow-xl w-full border border-[var(--border)] relative z-10 mb-6 bg-[var(--card)]/80 backdrop-blur-md">
              <label className="block text-sm opacity-70 mb-2 font-semibold tracking-wide text-[var(--text)]">Idioma / Language:</label>
              <select value={uiLang} onChange={e => setUiLang(e.target.value)} className="w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 text-[var(--text)] mb-4 outline-none focus:border-[var(--primary)] transition shadow-inner">
                <option value="fr">Français 🇫🇷</option>
                <option value="en">English 🇬🇧</option>
              </select>

              <label className="block text-sm opacity-70 mb-2 font-semibold tracking-wide text-[var(--text)]">Tempo / Tense:</label>
              <select value={tense} onChange={e => setTense(e.target.value)} className="w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 text-[var(--text)] mb-4 outline-none focus:border-[var(--primary)] transition shadow-inner">
                <option value="Presente">Presente</option>
                <option value="Futuro">Futuro do Presente</option>
                <option value="Pretérito Perfeito">Pretérito Perfeito</option>
                <option value="Pretérito Imperfeito">Pretérito Imperfeito</option>
              </select>

              <label className="flex items-center gap-3 mb-6 p-2 cursor-pointer text-[var(--text)] opacity-80 hover:opacity-100 transition">
                <input type="checkbox" checked={includeIrr} onChange={e => setIncludeIrr(e.target.checked)} className="w-5 h-5 accent-[var(--primary)]" />
                <span className="font-semibold">Inclure les irréguliers / Include irregulars</span>
              </label>

              <button onClick={() => startQuiz()} className="w-full p-4 rounded-xl bg-[var(--primary)] text-white font-bold uppercase tracking-wider hover:opacity-90 transition mb-3 shadow-[0_0_15px_rgba(28,154,166,0.3)]">
                Vamos! 🚀
              </button>
            </div>

            {topErrors.length > 0 && (
              <div className="card p-6 rounded-2xl shadow-xl w-full border border-[var(--border)] relative z-10 bg-[var(--card)]/80 backdrop-blur-md">
                <h3 className="text-md font-bold mb-4 opacity-80 uppercase tracking-widest text-[var(--primary)]">Top 5 Erros</h3>
                <div className="space-y-2">
                  {topErrors.map(([verb, stats]) => (
                    <div key={verb} className="flex justify-between items-center bg-[var(--bg)]/50 p-2 rounded px-4 text-sm text-[var(--text)] border border-white/5">
                      <span className="font-bold">{verb}</span>
                      <span className="text-rose-400 font-mono text-xs font-bold">{stats.err} Err</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center w-full">
            <div className="w-full flex justify-between items-center mb-6 px-2">
              <button onClick={() => setScreen('setup')} className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition px-3 py-1 bg-white/10 rounded text-[var(--text)]">
                Menu
              </button>
              <div className="text-sm font-bold text-[var(--primary)] drop-shadow-sm flex items-center justify-center gap-1">
                🔥 {userData.streak}
              </div>
            </div>

            <div className="card p-8 rounded-2xl shadow-2xl w-full border border-[var(--border)] text-center relative overflow-hidden bg-[var(--card)]/80 backdrop-blur-md">
               {currQ && (
                 <>
                   <div className="text-4xl md:text-5xl font-black text-[var(--primary)] mb-2" style={{ fontFamily: 'var(--font-main)' }}>{currQ.verb}</div>
                   <div className="text-lg italic opacity-70 mb-6 text-[var(--accent)]">{currQ.trans}</div>
                   
                   <div className="text-xs uppercase font-bold tracking-[0.2em] opacity-60 mb-2 text-[var(--text)]">{currQ.tense}</div>
                   <div className="text-2xl font-medium mb-6 bg-black/20 inline-block px-6 py-2 rounded-xl text-shadow-sm text-[var(--text)] border border-white/5">{currQ.person} ...</div>
                   
                   <input 
                     ref={inputRef}
                     type="text" 
                     value={inputVal}
                     onChange={e => setInputVal(e.target.value)}
                     onKeyDown={handleKeyPress}
                     placeholder={uiLang === 'en' ? 'Type the answer...' : 'Tapez a resposta...'}
                     autoComplete="off" autoCorrect="off" spellCheck="false" autoCapitalize="none"
                     className={`w-full p-4 rounded-xl border-2 text-center text-lg md:text-xl font-bold bg-[var(--bg)]/50 text-[var(--text)] outline-none transition-all shadow-inner ${feedback?.status === 'error' ? 'border-rose-500 bg-rose-500/10' : 'border-[var(--border)] focus:border-[var(--primary)]'}`}
                   />
                   
                   <div className="h-14 mt-4 flex items-center justify-center">
                     {feedback && (
                       <div className={`font-bold text-lg ${feedback.status === 'success' ? 'text-emerald-400' : 'text-rose-400 animate-shake'}`}>
                         {feedback.text}
                       </div>
                     )}
                   </div>

                   {isWaiting && (
                     <div className="mt-4 p-4 rounded-xl bg-[var(--bg)]/80 border border-indigo-500/30 animate-fade-in text-left shadow-sm">
                       <span className="text-xs uppercase tracking-widest opacity-60 block mb-1 text-[var(--text)]">Respostas e Regras</span>
                       <span className="text-2xl font-bold text-[var(--primary)] block">{currQ.answer}</span>
                       <span className="text-sm italic block text-[var(--accent)] mt-1">{currQ.rule}</span>
                       <div className="text-xs opacity-60 mt-3 flex items-center gap-2 text-[var(--text)]">
                         <span className="inline-block px-2 py-1 bg-white/10 rounded font-bold">Enter↵</span> para seguir
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
