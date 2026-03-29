import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import localforage from 'localforage';

const allVerbs = [{ fr: "être", es: "to be" }, { fr: "avoir", es: "to have" }, { fr: "faire", es: "to do/make" }, { fr: "dire", es: "to say" }, { fr: "aller", es: "to go" }, { fr: "voir", es: "to see" }, { fr: "savoir", es: "to know" }, { fr: "pouvoir", es: "can/able to" }, { fr: "vouloir", es: "to want" }, { fr: "venir", es: "to come" }, { fr: "prendre", es: "to take" }, { fr: "croire", es: "to believe" }, { fr: "mettre", es: "to put" }, { fr: "parler", es: "to speak" }, { fr: "manger", es: "to eat" }, { fr: "donner", es: "to give" }, { fr: "penser", es: "to think" }, { fr: "passer", es: "to pass" }, { fr: "regarder", es: "to look at" }, { fr: "aimer", es: "to love/like" }, { fr: "quitter", es: "to leave (a place)" }, { fr: "trouver", es: "to find" }, { fr: "rendre", es: "to return/give back" }, { fr: "comprendre", es: "to understand" }, { fr: "attendre", es: "to wait" }, { fr: "sortir", es: "to go out" }, { fr: "vivre", es: "to live" }, { fr: "entendre", es: "to hear" }, { fr: "chercher", es: "to search" }, { fr: "travailler", es: "to work" }, { fr: "appeler", es: "to call" }, { fr: "tomber", es: "to fall" }, { fr: "arriver", es: "to arrive" }, { fr: "partir", es: "to leave/depart" }, { fr: "connaître", es: "to know (somebody)" }, { fr: "devenir", es: "to become" }, { fr: "demander", es: "to ask" }, { fr: "acheter", es: "to buy" }, { fr: "rester", es: "to stay" }, { fr: "recevoir", es: "to receive" }, { fr: "devoir", es: "must/to have to" }, { fr: "conduire", es: "to drive" }, { fr: "sembler", es: "to seem" }, { fr: "tenir", es: "to hold" }, { fr: "porter", es: "to carry/wear" }, { fr: "montrer", es: "to show" }, { fr: "continuer", es: "to continue" }, { fr: "suivre", es: "to follow" }, { fr: "commencer", es: "to begin" }, { fr: "compter", es: "to count" }, { fr: "remettre", es: "to put back" }, { fr: "permettre", es: "to allow" }, { fr: "occuper", es: "to occupy" }, { fr: "décider", es: "to decide" }, { fr: "servir", es: "to serve" }, { fr: "revenir", es: "to come back" }, { fr: "laisser", es: "to leave/let" }, { fr: "répondre", es: "to answer" }, { fr: "rappeler", es: "to remind/recall" }, { fr: "présenter", es: "to present" }, { fr: "accepter", es: "to accept" }, { fr: "agir", es: "to act" }, { fr: "poser", es: "to pose/put down" }, { fr: "jouer", es: "to play" }, { fr: "reconnaître", es: "to recognize" }, { fr: "choisir", es: "to choose" }, { fr: "toucher", es: "to touch" }, { fr: "retrouver", es: "to find again" }, { fr: "perdre", es: "to lose" }, { fr: "expliquer", es: "to explain" }, { fr: "considérer", es: "to consider" }, { fr: "ouvrir", es: "to open" }, { fr: "gagner", es: "to win" }, { fr: "exister", es: "to exist" }, { fr: "refuser", es: "to refuse" }, { fr: "lire", es: "to read" }, { fr: "réussir", es: "to succeed" }, { fr: "changer", es: "to change" }, { fr: "représenter", es: "to represent" }, { fr: "assurer", es: "to assure" }, { fr: "essayer", es: "to try" }, { fr: "empêcher", es: "to prevent" }, { fr: "reprendre", es: "to retake" }, { fr: "mener", es: "to lead" }, { fr: "appartenir", es: "to belong" }];

export default function FrenchVocab() {
  const [stats, setStats] = useState({});
  const [globalData, setGlobalData] = useState({ bestStreak: 0, streak: 0 });
  const [screen, setScreen] = useState('setup'); // setup, quiz, stats
  const [mode, setMode] = useState('mcq');
  const [isFocus, setIsFocus] = useState(false);
  const [currentVerb, setCurrentVerb] = useState(null);
  const [options, setOptions] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const inputRef = useRef(null);

  useEffect(() => {
    localforage.getItem('fra_vocab_stats').then(s => { if (s) setStats(s); });
    localforage.getItem('fra_vocab_global').then(g => { if (g) setGlobalData(g); });
  }, []);

  const saveAll = (newStats, newGlobal) => {
    setStats(newStats);
    setGlobalData(newGlobal);
    localforage.setItem('fra_vocab_stats', newStats);
    localforage.setItem('fra_vocab_global', newGlobal);
  };

  const totalErrors = Object.values(stats).reduce((acc, v) => acc + (v.err || 0), 0);

  const startQuiz = (m, focus = false) => {
    setMode(m);
    setIsFocus(focus);
    setScreen('quiz');
    nextQuestion(focus, m);
  };

  const nextQuestion = (focusMode = isFocus, currentMode = mode) => {
    setIsTransitioning(false);
    setFeedback(null);
    setInputVal('');

    let pool = allVerbs;
    if (focusMode) {
      pool = allVerbs.filter(v => stats[v.fr] && stats[v.fr].err > 0);
      if (pool.length === 0) {
        setScreen('setup');
        alert("Bravo! Faiblesses corrigées.");
        return;
      }
    }

    const nextV = pool[Math.floor(Math.random() * pool.length)];
    setCurrentVerb(nextV);

    if (currentMode === 'mcq') {
      let opts = [nextV.fr];
      while (opts.length < 4) {
        let rV = allVerbs[Math.floor(Math.random() * allVerbs.length)].fr;
        if (!opts.includes(rV)) opts.push(rV);
      }
      setOptions(opts.sort(() => 0.5 - Math.random()));
    } else {
      setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 100);
    }
  };

  const handleAnswer = (answer) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const newStats = { ...stats };
    const newGlobal = { ...globalData };
    if (!newStats[currentVerb.fr]) newStats[currentVerb.fr] = { ok: 0, err: 0 };

    const correct = currentVerb.fr.toLowerCase();
    const userAns = answer.trim().toLowerCase();

    if (userAns === correct) {
      newGlobal.streak++;
      if (newGlobal.streak > newGlobal.bestStreak) newGlobal.bestStreak = newGlobal.streak;
      newStats[currentVerb.fr].ok++;
      if (isFocus && newStats[currentVerb.fr].err > 0) newStats[currentVerb.fr].err--;
      setFeedback({ status: 'success', text: "Correct! 🎉", selected: answer });
    } else {
      newGlobal.streak = 0;
      newStats[currentVerb.fr].err++;
      setFeedback({ status: 'error', text: `${currentVerb.fr}`, selected: answer, correctWord: correct });
    }

    saveAll(newStats, newGlobal);
    setTimeout(() => nextQuestion(), 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleAnswer(inputVal);
  };

  const clearData = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre progression ?")) {
      setStats({});
      setGlobalData({ streak: 0, bestStreak: 0 });
      localforage.removeItem('fra_vocab_stats');
      localforage.removeItem('fra_vocab_global');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in relative pt-16">
      <Link to="/fr" className="fixed top-4 left-4 glass px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-white/10 transition z-50">
        🔙 Retour
      </Link>

      <div className="w-full max-w-md w-full">
        {screen === 'setup' && (
          <div className="glass p-8 rounded-2xl shadow-xl w-full border border-white/5 relative z-10 text-center">
            <h1 className="text-4xl font-black mb-2 theme-gradient-text" style={{ fontFamily: 'var(--font-main)' }}>Vocabulaire 📚</h1>
            <p className="opacity-70 mb-8 font-serif italic text-lg">Maîtrisez les verbes français</p>

            <div className="space-y-4 mb-8">
              <button onClick={() => startQuiz('mcq')} className="w-full p-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider transition border border-white/20">
                QCM 🔘
              </button>
              <button onClick={() => startQuiz('type')} className="w-full p-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider transition border border-white/20">
                Écriture ✍️
              </button>
              {totalErrors > 0 && (
                <button onClick={() => startQuiz('type', true)} className="w-full p-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider transition shadow-[0_0_15px_rgba(79,70,229,0.4)] mt-4 border border-indigo-400">
                  Réparer mes {totalErrors} erreurs 🛠️
                </button>
              )}
            </div>

            <button onClick={() => setScreen('stats')} className="w-full p-3 rounded-lg bg-black/40 text-sm uppercase tracking-widest hover:bg-black/60 transition">
              Estadísticas 📊
            </button>
          </div>
        )}

        {screen === 'stats' && (
          <div className="glass p-8 rounded-2xl shadow-xl w-full border border-white/5 relative z-10">
            <h2 className="text-2xl font-bold mb-6 text-[var(--primary)] text-center" style={{ fontFamily: 'var(--font-main)' }}>Top Erreurs 📉</h2>
            <div className="max-h-64 overflow-y-auto space-y-2 mb-6 custom-scrollbar pr-2">
              {Object.keys(stats).filter(k => stats[k].err > 0).sort((a,b) => stats[b].err - stats[a].err).map(k => (
                <div key={k} className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                  <span className="font-bold text-lg font-serif inline-block px-2">{k}</span>
                  <div className="flex gap-4">
                    <span className="text-rose-400 font-mono font-bold">{stats[k].err} ✖</span>
                    <span className="text-emerald-400 font-mono font-bold">{stats[k].ok} ✔</span>
                  </div>
                </div>
              ))}
              {Object.keys(stats).filter(k => stats[k].err > 0).length === 0 && (
                <div className="text-center opacity-50 py-8 italic font-serif">Aucune donnée pour le moment.</div>
              )}
            </div>
            <button onClick={() => setScreen('setup')} className="w-full p-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider transition">Retour</button>
            <button onClick={clearData} className="w-full mt-4 text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-rose-400 transition">Effacer les données</button>
          </div>
        )}

        {screen === 'quiz' && currentVerb && (
          <div>
            <div className="w-full flex justify-between items-center mb-6 px-2">
              <button onClick={() => setScreen('setup')} className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition px-3 py-1 bg-white/5 rounded">
                Menu
              </button>
              <div className="text-xs font-bold text-[var(--primary)] uppercase tracking-[0.2em] px-3 py-1 bg-[var(--primary)]/10 rounded-full border border-[var(--primary)]/20">
                {isFocus ? "Révision 🛠️" : "Classique ⚡"}
              </div>
              <div className="text-sm font-bold text-[var(--primary)] drop-shadow-sm flex items-center justify-center gap-1">
                🔥 {globalData.streak} <span className="opacity-50 ml-1">({globalData.bestStreak})</span>
              </div>
            </div>

            <div className="glass p-8 rounded-2xl shadow-2xl w-full border border-white/10 text-center relative overflow-hidden">
               {isFocus && <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500"></div>}
               
               <div className="text-2xl md:text-3xl font-black text-white mb-8 mt-4 font-serif px-6 py-4 bg-white/5 inline-block rounded-2xl border border-white/10 drop-shadow-lg shadow-inner">
                 « {currentVerb.es.toUpperCase()} »
               </div>
               
               {mode === 'type' ? (
                 <div className="mt-4 mb-6 relative">
                   <input 
                     ref={inputRef} type="text" value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={handleKeyPress}
                     placeholder="Écrivez en français..."
                     autoComplete="off" autoCorrect="off" spellCheck="false" autoCapitalize="none"
                     disabled={isTransitioning}
                     className="w-full p-4 rounded-xl border-2 text-center text-xl font-bold bg-black/40 text-white outline-none transition shadow-inner focus:border-[var(--primary)] border-white/10"
                   />
                 </div>
               ) : (
                 <div className="grid grid-cols-1 gap-3 mb-6">
                   {options.map(opt => {
                     let btnClass = "border border-white/20 bg-white/5 hover:bg-white/10 text-white shadow-sm";
                     if (feedback) {
                       if (opt === currentVerb.fr) btnClass = "border-emerald-500 bg-emerald-500/20 text-emerald-300";
                       else if (opt === feedback.selected && feedback.status === 'error') btnClass = "border-rose-500 bg-rose-500/10 text-rose-300 opacity-50";
                       else btnClass = "border-white/5 bg-black/20 opacity-30 text-white";
                     }
                     return (
                       <button
                         key={opt}
                         disabled={isTransitioning}
                         onClick={() => handleAnswer(opt)}
                         className={`w-full p-4 rounded-xl font-bold uppercase tracking-wider transition duration-300 text-lg font-serif ${btnClass}`}
                       >
                         {opt}
                       </button>
                     );
                   })}
                 </div>
               )}

               <div className="h-10 flex items-center justify-center">
                 {feedback && (
                   <div className={`font-bold font-serif text-2xl ${feedback.status === 'success' ? 'text-emerald-400' : 'text-rose-500 animate-shake'}`}>
                     {feedback.text}
                   </div>
                 )}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
