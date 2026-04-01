import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import localforage from 'localforage';

const db = {
    people: ["Je", "Tu", "Il/Elle", "Nous", "Vous", "Ils/Elles"],
    verbs: [
        { fr: "Être", en: "to be", es: "ser/estar", level: 2, irr: { "Present": ["suis", "es", "est", "sommes", "êtes", "sont"], "Past Compound": ["ai été", "as été", "a été", "avons été", "avez été", "ont été"] } },
        { fr: "Avoir", en: "to have", es: "tener", level: 2, irr: { "Present": ["ai", "as", "a", "avons", "avez", "ont"], "Past Compound": ["ai eu", "as eu", "a eu", "avons eu", "avez eu", "ont eu"] } },
        { fr: "Aller", en: "to go", es: "ir", level: 2, irr: { "Present": ["vais", "vas", "va", "allons", "allez", "vont"], "Past Compound": ["suis allé", "es allé", "est allé", "sommes allés", "êtes allés", "sont allés"] } },
        { fr: "Faire", en: "to do/make", es: "hacer", level: 2, irr: { "Present": ["fais", "fais", "fait", "faisons", "faites", "font"], "Past Compound": ["ai fait", "as fait", "a fait", "avons fait", "avez fait", "ont fait"] } },
        { fr: "Dire", en: "to say", es: "decir", level: 2, irr: { "Present": ["dis", "dis", "dit", "disons", "dites", "disent"], "Past Compound": ["ai dit", "as dit", "a dit", "avons dit", "avez dit", "ont dit"] } },
        { fr: "Pouvoir", en: "can/to be able", es: "poder", level: 3, irr: { "Present": ["peux", "peux", "peut", "pouvons", "pouvez", "peuvent"], "Past Compound": ["ai pu", "as pu", "a pu", "avons pu", "avez pu", "ont pu"] } },
        { fr: "Vouloir", en: "to want", es: "querer", level: 3, irr: { "Present": ["veux", "veux", "veut", "voulons", "voulez", "veulent"], "Past Compound": ["ai voulu", "as voulu", "a voulu", "avons voulu", "avez voulu", "ont voulu"] } },
        { fr: "Savoir", en: "to know", es: "saber", level: 3, irr: { "Present": ["sais", "sais", "sait", "savons", "savez", "savent"], "Past Compound": ["ai su", "as su", "a su", "avons su", "avez su", "ont su"] } },
        { fr: "Venir", en: "to come", es: "venir", level: 3, irr: { "Present": ["viens", "viens", "vient", "venons", "venez", "viennent"], "Past Compound": ["suis venu", "es venu", "est venu", "sommes venus", "êtes venus", "sont venus"] } },
        { fr: "Prendre", en: "to take", es: "tomar", level: 2, irr: { "Present": ["prends", "prends", "prend", "prenons", "prenez", "prennent"], "Past Compound": ["ai pris", "as pris", "a pris", "avons pris", "avez pris", "ont pris"] } },
        { fr: "Voir", en: "to see", es: "ver", level: 2, irr: { "Present": ["vois", "vois", "voit", "voyons", "voyez", "voient"], "Past Compound": ["ai vu", "as vu", "a vu", "avons vu", "avez vu", "ont vu"] } },
        { fr: "Mettre", en: "to put", es: "poner", level: 3, irr: { "Present": ["mets", "mets", "met", "mettons", "mettez", "mettent"], "Past Compound": ["ai mis", "as mis", "a mis", "avons mis", "avez mis", "ont mis"] } },
        { fr: "Devoir", en: "must/have to", es: "deber/tener que", level: 3, irr: { "Present": ["dois", "dois", "doit", "devons", "devez", "doivent"], "Past Compound": ["ai dû", "as dû", "a dû", "avons dû", "avez dû", "ont dû"] } },
        { fr: "Lire", en: "to read", es: "leer", level: 2, irr: { "Present": ["lis", "lis", "lit", "lisons", "lisez", "lisent"], "Past Compound": ["ai lu", "as lu", "a lu", "avons lu", "avez lu", "ont lu"] } },
        { fr: "Écrire", en: "to write", es: "escribir", level: 2, irr: { "Present": ["écris", "écris", "écrit", "écrivons", "écrivez", "écrivent"], "Past Compound": ["ai écrit", "as écrit", "a écrit", "avons écrit", "avez écrit", "ont écrit"] } },
        { fr: "Aimer", en: "to love", es: "amar", level: 1, group: "er" }, 
        { fr: "Manger", en: "to eat", es: "comer", level: 1, group: "er" },
        { fr: "Parler", en: "to speak", es: "hablar", level: 1, group: "er" },
        { fr: "Travailler", en: "to work", es: "trabajar", level: 1, group: "er" },
        { fr: "Donner", en: "to give", es: "dar", level: 1, group: "er" },
        { fr: "Appeler", en: "to call", es: "llamar", level: 2, group: "er_irr", irr: { "Present": ["appelle", "appelles", "appelle", "appelons", "appelez", "appellent"], "Past Compound": ["ai appelé", "as appelé", "a appelé", "avons appelé", "avez appelé", "ont appelé"] } },
        { fr: "Acheter", en: "to buy", es: "comprar", level: 2, group: "er_irr", irr: { "Present": ["achète", "achètes", "achète", "achetons", "achetez", "achètent"], "Past Compound": ["ai acheté", "as acheté", "a acheté", "avons acheté", "avez acheté", "ont acheté"] } },
        { fr: "Finir", en: "to finish", es: "terminar", level: 1, group: "ir" },
        { fr: "Choisir", en: "to choose", es: "elegir", level: 1, group: "ir" },
        { fr: "Réussir", en: "to succeed", es: "tener éxito", level: 2, group: "ir" },
        { fr: "Sortir", en: "to go out", es: "salir", level: 2, irr: { "Present": ["sors", "sors", "sort", "sortons", "sortez", "sortent"], "Past Compound": ["suis sorti", "es sorti", "est sorti", "sommes sortis", "êtes sortis", "sont sortis"] } },
        { fr: "Partir", en: "to leave", es: "irse/partir", level: 2, irr: { "Present": ["pars", "pars", "part", "partons", "partez", "partent"], "Past Compound": ["suis parti", "es parti", "est parti", "sommes partis", "êtes partis", "sont partis"] } },
        { fr: "Vendre", en: "to sell", es: "vender", level: 1, group: "re", irr: { "Present": ["vends", "vends", "vend", "vendons", "vendez", "vendent"], "Past Compound": ["ai vendu", "as vendu", "a vendu", "avons vendu", "avez vendu", "ont vendu"] } },
        { fr: "Attendre", en: "to wait", es: "esperar", level: 1, group: "re", irr: { "Present": ["attends", "attends", "attend", "attendons", "attendez", "attendent"], "Past Compound": ["ai attendu", "as attendu", "a attendu", "avons attendu", "avez attendu", "ont attendu"] } },
        { fr: "Répondre", en: "to answer", es: "responder", level: 2, group: "re", irr: { "Present": ["réponds", "réponds", "répond", "répondons", "répondez", "répondent"], "Past Compound": ["ai répondu", "as répondu", "a répondu", "avons répondu", "avez répondu", "ont répondu"] } },
        { fr: "Boire", en: "to drink", es: "beber", level: 3, irr: { "Present": ["bois", "bois", "boit", "buvons", "buvez", "boivent"], "Past Compound": ["ai bu", "as bu", "a bu", "avons bu", "avez bu", "ont bu"] } },
        { fr: "Connaître", en: "to know (sb)", es: "conocer", level: 3, irr: { "Present": ["connais", "connais", "connaît", "connaissons", "connaissez", "connaissent"], "Past Compound": ["ai connu", "as connu", "a connu", "avons connu", "avez connu", "ont connu"] } },
        { fr: "Vivre", en: "to live", es: "vivir", level: 3, irr: { "Present": ["vis", "vis", "vit", "vivons", "vivez", "vivent"], "Past Compound": ["ai vécu", "as vécu", "a vécu", "avons vécu", "avez vécu", "ont vécu"] } },
        { fr: "Dormir", en: "to sleep", es: "dormir", level: 2, irr: { "Present": ["dors", "dors", "dort", "dormons", "dormez", "dorment"], "Past Compound": ["ai dormi", "as dormi", "a dormi", "avons dormi", "avez dormi", "ont dormi"] } },
        { fr: "Ouvrir", en: "to open", es: "abrir", level: 2, irr: { "Present": ["ouvre", "ouvres", "ouvre", "ouvrons", "ouvrez", "ouvrent"], "Past Compound": ["ai ouvert", "as ouvert", "a ouvert", "avons ouvert", "avez ouvert", "ont ouvert"] } }
    ]
};

export default function FrenchConjugation() {
  const [userData, setUserData] = useState({ streak: 0, bestStreak: 0, verbs: {} });
  const [lang, setLang] = useState('en');
  const [screen, setScreen] = useState('setup');
  const [currQ, setCurrQ] = useState(null);
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [level, setLevel] = useState(3);
  const [tense, setTense] = useState("Present");
  const [focusMode, setFocusMode] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    localforage.getItem('fra_master_react').then(data => { if (data) setUserData(data); });
    localforage.getItem('fra_source_lang').then(l => { if (l) setLang(l); });
  }, []);

  const ui = {
    en: {
        back: "🔙 Back",
        level: "Level :",
        level1: "Level 1: Regulars (ER/IR)",
        level2: "Level 2: Essentials",
        level3: "Level 3: All Verbs",
        tense: "Tense :",
        pres: "Present",
        past: "Past Compound",
        start: "Start 🚀",
        weak: "Review Weak Spots ⚡",
        topErr: "Top Errors",
        excellent: "Excellent!",
        correction: "Correction:",
        expected: "Expected Answer",
        continue: "Enter↵ to continue",
        type: "Type your answer...",
        streak: "Streak:",
        record: "Record:"
    },
    es: {
        back: "🔙 Volver",
        level: "Nivel:",
        level1: "Nivel 1: Regulares (ER/IR)",
        level2: "Nivel 2: Esenciales",
        level3: "Nivel 3: Todos los verbos",
        tense: "Tiempo:",
        pres: "Presente",
        past: "Pasado Compuesto",
        start: "Comenzar 🚀",
        weak: "Repasar puntos débiles ⚡",
        topErr: "Principales errores",
        excellent: "¡Excelente!",
        correction: "Corrección:",
        expected: "Respuesta esperada",
        continue: "Intro↵ para continuar",
        type: "Escribe tu respuesta...",
        streak: "Racha:",
        record: "Récord:"
    }
  };

  const curUI = ui[lang] || ui.en;

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
        alert(lang === 'es' ? "¡Buen trabajo! No hay más puntos débiles por ahora." : "Great job! No more weak spots for now.");
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
        if (tense === "Present") {
            const ends = verb.group === "er" ? ["e", "es", "e", "ons", "ez", "ent"] : ["is", "is", "it", "issons", "issez", "issent"];
            answer = root + ends[pIdx];
        } else {
            const aux = ["ai", "as", "a", "avons", "avez", "ont"];
            answer = aux[pIdx] + " " + (verb.group === "er" ? root.toLowerCase() + "é" : root.toLowerCase() + "i");
        }
    }

    let person = db.people[pIdx];
    if (person === "Je" && /^[aeiouh]/i.test(answer)) person = "J'";
    
    setCurrQ({ verb: verb.fr, tense: tense, person: person, answer: answer, trans: verb[lang] || verb.en });
    
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
        
        setFeedback({ status: 'success', text: curUI.excellent });
        saveUserData(newUserData);
        setTimeout(() => nextQuestion(), 800);
      } else {
        setIsWaiting(true);
        newUserData.verbs[currQ.verb].err++;
        newUserData.streak = 0;
        setFeedback({ status: 'error', text: curUI.correction });
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
        {curUI.back}
      </Link>

      <div className="w-full max-w-md w-full">
        {screen === 'setup' ? (
          <>
            <div className="text-center mb-6">
              <div className="text-lg font-bold text-[var(--primary)] mb-2 drop-shadow-sm flex items-center justify-center gap-2">
                🔥 {curUI.streak} {userData.streak} <span className="opacity-50 text-sm">({curUI.record} {userData.bestStreak || 0})</span>
              </div>
              <h1 className="text-4xl font-black mb-2 theme-gradient-text" style={{ fontFamily: 'var(--font-main)' }}>{lang === 'es' ? 'Conjugación' : 'Conjugation'} ✍️</h1>
            </div>

            <div className="glass p-6 rounded-2xl shadow-xl w-full border border-white/5 relative z-10 mb-6">
              <label className="block text-sm opacity-70 mb-2 font-semibold tracking-wide">{curUI.level}</label>
              <select value={level} onChange={e => setLevel(Number(e.target.value))} className="w-full p-4 rounded-xl border border-white/10 bg-black/40 text-white mb-4 outline-none focus:border-[var(--primary)] transition">
                <option value={1}>{curUI.level1}</option>
                <option value={2}>{curUI.level2}</option>
                <option value={3}>{curUI.level3}</option>
              </select>

              <label className="block text-sm opacity-70 mb-2 font-semibold tracking-wide">{curUI.tense}</label>
              <select value={tense} onChange={e => setTense(e.target.value)} className="w-full p-4 rounded-xl border border-white/10 bg-black/40 text-white mb-6 outline-none focus:border-[var(--primary)] transition">
                <option value="Present">{curUI.pres}</option>
                <option value="Past Compound">{curUI.past}</option>
              </select>

              <button onClick={() => startQuiz(false)} className="w-full p-4 rounded-xl bg-[var(--primary)] text-[var(--bg)] font-bold uppercase tracking-wider hover:opacity-90 transition mb-3 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                {curUI.start}
              </button>
              
              {hasErrors && (
                <button onClick={() => startQuiz(true)} className="w-full p-4 rounded-xl bg-indigo-600 text-white font-bold uppercase tracking-wider hover:bg-indigo-500 transition shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                  {curUI.weak}
                </button>
              )}
            </div>

            {topErrors.length > 0 && (
              <div className="glass p-6 rounded-2xl shadow-xl w-full border border-white/5 relative z-10">
                <h3 className="text-md font-bold mb-4 opacity-80 uppercase tracking-widest text-[var(--primary)]">{curUI.topErr}</h3>
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
                   
                   <div className="text-xs uppercase font-bold tracking-[0.2em] opacity-60 mb-2">{currQ.tense === 'Present' ? curUI.pres : curUI.past}</div>
                   <div className="text-2xl font-medium mb-6 bg-white/5 inline-block px-6 py-2 rounded-xl text-shadow-sm">{currQ.person}...</div>
                   
                   <input 
                     ref={inputRef}
                     type="text" 
                     value={inputVal}
                     onChange={e => setInputVal(e.target.value)}
                     onKeyDown={handleKeyPress}
                     placeholder={curUI.type}
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
                       <span className="text-xs uppercase tracking-widest opacity-50 block mb-1">{curUI.expected}</span>
                       <span className="text-2xl font-bold text-[var(--primary)] font-serif block">{currQ.answer}</span>
                       <div className="text-xs opacity-50 mt-3 flex items-center gap-2">
                         <span className="inline-block px-2 py-1 bg-white/10 rounded">Enter↵</span> {curUI.continue}
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
